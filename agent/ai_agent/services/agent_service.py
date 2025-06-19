import httpx
import unicodedata
from typing import Optional

from core.config import settings
from api.nest_client import NestClient
from llms.gemini_llm import GeminiClient


def normalize(text: str) -> str:
    return unicodedata.normalize("NFD", text).encode("ascii", "ignore").decode("utf-8").lower()


class AgentService:
    def __init__(self):
        print("OPENAI_API_KEY:", settings.openai_api_key)
        print("GOOGLE_API_KEY:", settings.google_api_key)
        print("API_URL:", settings.api_url)

        self.llm = GeminiClient(api_key=settings.google_api_key)
        self.nest = NestClient(api_url=str(settings.api_url))
        
    async def close(self):
        await self.llm.close()
        await self.nest.close()

    async def handle_user_message(self, message: str, cart_id: int | None = None) -> dict:
        print(f"Received cart_id from frontend: {cart_id}")
        
        if not await self.nest.ping():
            print("Warning: Backend might be down or cold start")

        result = await self.llm.detect_intent(message)

        intent = result.get("intent", "unknown")
        items = result.get("items", [])
        llm_message = result.get("message")
        response_cart_id = cart_id 

        if intent == "get_product_by_name" and result.get("product_name"):
            product_name = result["product_name"].strip()
            products = await self.nest.search_products_by_name(product_name)
            if len(products) == 1:
                p = products[0]
                details = (
                    f"\nProduct: {p['name']}\n"
                    f"Price: ${p['price']}\n"
                    f"Stock: {p['stock']} unidades\n"
                    f"Description: {p.get('description', 'No Description provided.')}\n"
                )
                response_text = (llm_message or "") + details
            elif len(products) > 1:
                product_lines = [
                    f"- {p['name']} (Price: ${p['price']}, Stock: {p['stock']}, Description: {p.get('description', 'No Description provided.')})"
                    for p in products
                ]
                details = "\nWe found some products with the same name:\n" + "\n".join(product_lines) + "\nPlease specify which one you want."
                response_text = (llm_message or "") + details
            else:
                details = f"\nProducts with name '{product_name}' not found. Try another name."
                response_text = (llm_message or "") + details

        elif intent == "get_products":
            products = await self.nest.get_products()
            names = ", ".join(p["name"] for p in products)
            response_text = (llm_message or "") + f"\n{names}"

        elif intent in ["add_to_cart", "update_cart"]:
            should_create_cart = False
            current_cart_id = cart_id
            
            if intent == "add_to_cart":
                if current_cart_id is None:
                    should_create_cart = True
                    print("🆕 Creating new cart: no cart_id exists")
                else:
                    try:
                        cart_response = await self.nest.get_cart(current_cart_id)
                        print(f"✅ Cart {current_cart_id} exists, will update it")
                        should_create_cart = False
                    except httpx.HTTPStatusError as e:
                        if e.response.status_code == 404:
                            print(f"❌ Cart {current_cart_id} not found, creating new one")
                            should_create_cart = True
                            current_cart_id = None
                        else:
                            raise
            
            elif intent == "update_cart":
                if current_cart_id is None:
                    return {
                        "response": (llm_message or "Looks like you don't have an active cart yet. Try adding some products first!"),
                        "cart_id": None
                    }
                
                try:
                    await self.nest.get_cart(current_cart_id)
                    should_create_cart = False
                    print(f"✅ Cart {current_cart_id} exists, will update it")
                except httpx.HTTPStatusError as e:
                    if e.response.status_code == 404:
                        return {
                            "response": (llm_message or "Oops, your cart seems to be gone. Let's start fresh—add some products to create a new cart!"),
                            "cart_id": None
                        }
                    else:
                        raise

            parsed_items = []
            for item in items:
                name = item.get("product_name", "").strip()
                qty = item.get("quantity", 1)
                if not name:
                    continue
                matches = await self.nest.search_products_by_name(name)
                if not matches:
                    return {
                        "response": (llm_message or f"Sorry, I couldn't find a product called '{name}'. Want to try another name?"),
                        "cart_id": current_cart_id
                    }
                parsed_items.append({
                    "product_id": matches[0]["id"],
                    "qty": qty
                })
            if not parsed_items:
                return {
                    "response": (llm_message or "I couldn't find any valid products in your request. Could you double-check the names?"),
                    "cart_id": current_cart_id
                }
            try:
                if should_create_cart:
                    print("🆕 Creating new cart with items")
                    cart = await self.nest.create_cart(items=parsed_items)
                    current_cart_id = cart["id"]
                    details = "\n".join([
                        f"- {i['qty']}x {p['product']['name']} @ ${p['product']['price']} = ${p['qty'] * p['product']['price']}"
                        for p in cart['items']
                        for i in parsed_items if i['product_id'] == p['product']['id']
                    ])
                    response_text = (llm_message or "") + f"\n{details}\nCart ID: {current_cart_id}"
                else:
                    print(f"🔄 Updating existing cart {current_cart_id}")
                    cart = await self.nest.update_cart(current_cart_id, data={"items": parsed_items})
                    details = "\n".join([
                        f"- {i['qty']}x {p['product']['name']} @ ${p['product']['price']} = ${p['qty'] * p['product']['price']}"
                        for p in cart['items']
                        for i in parsed_items if i['product_id'] == p['product']['id']
                    ])
                    response_text = (llm_message or "") + f"\n{details}\nCart ID: {current_cart_id}"
            except httpx.HTTPStatusError as e:
                detail = e.response.json().get("message", str(e)) if e.response else str(e)
                response_text = (llm_message or "") + f"\nNo se pudo procesar el carrito: {detail}"

        elif intent == "get_cart":
            if cart_id is None:
                response_text = (llm_message or "You don't have an active cart yet. Add some products and I'll create one for you!")
                response_cart_id = None
            else:
                try:
                    cart = await self.nest.get_cart(cart_id)
                    items_list = "\n".join(
                        f"- {item['qty']}x {item['product']['name']} @ ${item['product']['price']}"
                        for item in cart["items"]
                    )
                    total = sum(item['qty'] * item['product']['price'] for item in cart['items'])
                    if cart["items"]:
                        saludo = "¡Aquí está tu carrito!" if not llm_message else llm_message.split(".")[0] + "."
                        response_text = f"{saludo}\n{items_list}\nTotal: ${total}"
                    else:
                        response_text = (llm_message or "Tu carrito está vacío. ¡Agrega productos para comenzar!")
                    response_cart_id = cart_id
                except httpx.HTTPStatusError as e:
                    if e.response.status_code == 404:
                        response_text = (llm_message or "Looks like your cart doesn't exist anymore. Add some products and I'll set up a new one!")
                        response_cart_id = None
                    else:
                        response_text = (llm_message or "") + f"\nNo se pudo obtener tu carrito: {e.response.text}"
                        response_cart_id = cart_id

        else:
            response_text = llm_message or "Oops, I didn't quite get that. Could you rephrase or ask me something else?"
            response_cart_id = cart_id

        return {
            "response": response_text,
            "cart_id": current_cart_id if intent in ["add_to_cart", "update_cart"] else response_cart_id
        }