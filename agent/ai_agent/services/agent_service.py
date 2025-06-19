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
        print("🧺asOPENAI_API_KEY:", settings.openai_api_key)
        print("🧺asGOOGLE_API_KEY:", settings.google_api_key)
        print("🧺asAPI_URL:", settings.api_url)

        self.llm = GeminiClient(api_key=settings.google_api_key)
        self.nest = NestClient(api_url=str(settings.api_url))
        
    async def close(self):
        await self.llm.close()
        await self.nest.close()

    async def handle_user_message(self, message: str, cart_id: int | None = None) -> dict:
        print(f"🛒 Received cart_id from frontend: {cart_id}")

        result = await self.llm.detect_intent(message)

        intent = result.get("intent", "unknown")
        items = result.get("items", [])

        if intent == "get_product_by_name" and result.get("product_name"):
            product_name = result["product_name"].strip()
            products = await self.nest.search_products_by_name(product_name)
            if len(products) == 1:
                p = products[0]
                response_text = (
                    f"Product: {p['name']}\n"
                    f"Price: ${p['price']}\n"
                    f"Stock: {p['stock']} units\n"
                    f"Description: {p.get('description', 'Not available')}\n"
                )
            elif len(products) > 1:
                names = ", ".join(p["name"] for p in products)
                response_text = f"Found multiple products matching '{product_name}': {names}. Please specify which one you want."
            else:
                response_text = f"No matching products found for '{product_name}'. Please try a different search term."

        elif intent == "get_products":
            products = await self.nest.get_products()
            names = ", ".join(p["name"] for p in products)
            response_text = (
                f"Here are the available products:\n"
                f"{names}\n"
                f"You can ask for details about a specific product or add one to your cart."
            )

        elif intent in ["add_to_cart", "update_cart"]:
            # Determinar si crear o actualizar carrito
            should_create_cart = False
            current_cart_id = cart_id
            
            if intent == "add_to_cart":
                # Si no hay cart_id, crear uno nuevo
                if current_cart_id is None:
                    should_create_cart = True
                    print("🆕 Creating new cart: no cart_id exists")
                else:
                    # Si hay cart_id, verificar si existe en el backend
                    try:
                        # Intentar obtener el carrito para verificar que existe
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
                # Para update_cart, siempre necesitamos un carrito existente
                if current_cart_id is None:
                    return {
                        "response": "You don't have an active cart to update. Please add some products first.",
                        "cart_id": None
                    }
                
                # Verificar que el carrito existe
                try:
                    await self.nest.get_cart(current_cart_id)
                    should_create_cart = False
                    print(f"✅ Cart {current_cart_id} exists, will update it")
                except httpx.HTTPStatusError as e:
                    if e.response.status_code == 404:
                        return {
                            "response": "Your cart no longer exists. Please add products to create a new cart.",
                            "cart_id": None
                        }
                    else:
                        raise

            # Procesar los items
            parsed_items = []
            for item in items:
                name = item.get("product_name", "").strip()
                qty = item.get("quantity", 1)
                if not name:
                    continue
                matches = await self.nest.search_products_by_name(name)
                if not matches:
                    return {
                        "response": f"Product '{name}' not found.",
                        "cart_id": current_cart_id
                    }
                parsed_items.append({
                    "product_id": matches[0]["id"],
                    "qty": qty
                })

            if not parsed_items:
                return {
                    "response": "No valid products found in your request.",
                    "cart_id": current_cart_id
                }

            try:
                if should_create_cart:
                    print("🆕 Creating new cart with items")
                    cart = await self.nest.create_cart(items=parsed_items)
                    current_cart_id = cart["id"]
                    response_text = (
                        f"A new cart has been created.\n"
                        + "\n".join([
                            f"- {i['qty']}x {p['product']['name']} @ ${p['product']['price']} = ${p['qty'] * p['product']['price']}"
                            for p in cart['items']
                            for i in parsed_items if i['product_id'] == p['product']['id']
                        ])
                        + f"\nCart ID: {current_cart_id}"
                    )
                else:
                    print(f"🔄 Updating existing cart {current_cart_id}")
                    cart = await self.nest.update_cart(current_cart_id, data={"items": parsed_items})
                    response_text = (
                        f"Cart updated successfully.\n"
                        + "\n".join([
                            f"- {i['qty']}x {p['product']['name']} @ ${p['product']['price']} = ${p['qty'] * p['product']['price']}"
                            for p in cart['items']
                            for i in parsed_items if i['product_id'] == p['product']['id']
                        ])
                        + f"\nCart ID: {current_cart_id}"
                    )
            except httpx.HTTPStatusError as e:
                detail = e.response.json().get("message", str(e)) if e.response else str(e)
                response_text = f"Could not process the cart: {detail}"
                
        elif intent == "get_cart":
            if cart_id is None:
                response_text = "You don't have an active cart. Please add products to create a new cart."
            else:
                try:
                    cart = await self.nest.get_cart(cart_id)
                    items_list = "\n".join(
                        f"- {item['qty']}x {item['product']['name']} @ ${item['product']['price']}"
                        for item in cart["items"]
                    )
                    response_text = (
                        f"Your cart (ID: {cart_id}):\n"
                        f"{items_list}\n"
                        f"Total: ${sum(item['qty'] * item['product']['price'] for item in cart['items'])}"
                    )
                except httpx.HTTPStatusError as e:
                    if e.response.status_code == 404:
                        response_text = "Your cart does not exist. Please add products to create a new cart."
                    else:
                        response_text = f"Could not retrieve your cart: {e.response.text}"

        else:
            response_text = "I'm sorry, I didn't understand that. Can you please rephrase your request?"

        return {
            "response": response_text,
            "cart_id": current_cart_id if intent in ["add_to_cart", "update_cart"] else cart_id
        }