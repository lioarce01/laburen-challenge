import httpx
import unicodedata
from typing import Optional

from core.config import settings
from api.nest_client import NestClient
from llms.gemini_llm import GeminiClient
# from llms.openai_llm import OpenAIClient

def normalize(text: str) -> str:
    return unicodedata.normalize("NFD", text).encode("ascii", "ignore").decode("utf-8").lower()

class AgentService:
    def __init__(self):
        print("🧪 OPENAI_API_KEY:", settings.openai_api_key)
        print("🧪 GOOGLE_API_KEY:", settings.google_api_key)
        print("🧪 API_URL:", settings.api_url)

        self.llm = GeminiClient(api_key=settings.google_api_key)
        self.nest = NestClient(api_url=str(settings.api_url))
        self.cart_id: Optional[int] = None

    async def handle_user_message(self, message: str, cart_id: int | None = None) -> dict:
        if cart_id:
            self.cart_id = cart_id
            
        result = await self.llm.detect_intent(message)
        
        intent = result.get("intent", "unknown")
        product_name = result.get("product_name", "").strip()
        product_id = result.get("product_id", "").strip()
        quantity = result.get("quantity", 1)

        if intent == "get_product_by_name" and product_name:
            products = await self.nest.search_products_by_name(product_name)
            if len(products) == 1:
                p = products[0]
                response_text = (
                    f"**Product:** {p['name']}\n"
                    f"**Price:** ${p['price']}\n"
                    f"**Stock:** {p['stock']} units\n"
                    f"**Description:** {p.get('description', 'Not available')}\n"
                )
            elif len(products) > 1:
                names = ", ".join(p["name"] for p in products)
                response_text = f"Found multiple products matching '{product_name}': {names}. Please specify which one you want."
            else:
                response_text = f"No matching products found for '{product_name}'. Please try a different search term."

        elif intent == "get_products":
            products = await self.nest.get_products()
            names = ", ".join(p["name"] for p in products)
            response_text = f"Available products: {names}"

        elif intent == "add_to_cart":
            if not product_id and product_name:
                products = await self.nest.search_products_by_name(product_name)
                if products:
                    product_id = products[0]['id']
                    product = products[0]
                else:
                    return {"response": f"Product '{product_name}' not found to add to the cart."}
            else:
                product = await self.nest.get_product_by_id(product_id)

            if product_id:
                try:
                    if not self.cart_id:
                        cart = await self.nest.create_cart(items=[{"product_id": int(product_id), "qty": quantity}])
                        self.cart_id = cart['id']
                        response_text = (
                            f"A new cart has been created.\n"
                            f"Product added:\n"
                            f"- Name: {product['name']}\n"
                            f"- Quantity: {quantity}\n"
                            f"- Unit Price: ${product['price']}\n"
                            f"- Total Partial: ${product['price'] * quantity}\n"
                            f"- Cart ID: {self.cart_id}"
                        )
                    else:
                        cart = await self.nest.update_cart(self.cart_id, data={"items": [{"product_id": int(product_id), "qty": quantity}]})
                        response_text = (
                            f"Cart updated.\n"
                            f"- Product: {product['name']}\n"
                            f"- New Quantity: {quantity}\n"
                            f"- Unit Price: ${product['price']}\n"
                            f"- Total Partial: ${product['price'] * quantity}\n"
                            f"- Cart ID: {self.cart_id}"
                        )
                except httpx.HTTPStatusError as e:
                    detail = e.response.json().get("message", str(e))
                    response_text = f"Error during cart updating: {detail}"

        elif intent == "update_cart":
            if not self.cart_id:
                return {"response": "You don't have an active cart to update. Please add some products first."}

            if not product_id and product_name:
                products = await self.nest.search_products_by_name(product_name)
                if products:
                    product_id = products[0]['id']
                    product = products[0]
                else:
                    return {"response": f"'{product_name}' not found to update the cart."}
            else:
                product = await self.nest.get_product_by_id(product_id)

            try:
                cart = await self.nest.update_cart(self.cart_id, data={"items": [{"product_id": int(product_id), "qty": quantity}]})
                response_text = (
                    f"Cart updated successfully.\n"
                    f"- Product: {product['name']}\n"
                    f"- Current Quantity: {quantity}\n"
                    f"- Total Partial: ${product['price'] * quantity}\n"
                    f"- Cart ID: {self.cart_id}"
                )
            except httpx.HTTPStatusError as e:
                detail = e.response.json().get("message", str(e))
                response_text = f"Could not update the cart: {detail}"

        else:
            response_text = "I'm sorry, I didn't understand that. Can you please rephrase your request?"

        return {"response": response_text}
