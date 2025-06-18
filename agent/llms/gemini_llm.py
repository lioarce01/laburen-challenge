import google.generativeai as genai
from llms.interface import LLMInterface
import asyncio
import json

def clean_response(text: str) -> str:
    lines = text.strip().splitlines()

    if lines and lines[0].lower() in ("json", "response:"):
        lines.pop(0)

    lines = [line for line in lines if line.strip() not in ("```", "```json")]

    cleaned = "\n".join(lines).strip()

    return cleaned

class GeminiClient(LLMInterface):
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def _detect_intent_sync(self, message: str) -> dict:
        prompt = f"""
            You are a smart assistant for an online shopping platform.

            You will receive user messages in Spanish or English.
            Detect the user's intent and extract relevant data in a **strict JSON format**.

            Respond ONLY with valid JSON, like:

            {{
            "intent": "get_product_by_name",
            "product_name": "camiseta",
            "product_id": "",
            "quantity": 0
            }}

            Include only the relevant keys for the detected intent. Use empty string or 0 if the value was not provided.

            Valid intents:
            - get_products → List all products.
            - get_product_by_name → Search products by name or description.
            - get_product_by_id → Get product by exact ID.
            - add_to_cart → Add product to cart (this creates a new cart if it doesn't exist).
            - update_cart → Change quantity of an item in the cart.
            - unknown → Unknown or unsupported request.

            Examples:

            Message: "Quiero ver todos los productos disponibles"
            Response:
            {{ "intent": "get_products" }}

            Message: "Show me all products"
            Response:
            {{ "intent": "get_products" }}

            Message: "Mostrame una camiseta"
            Response:
            {{ "intent": "get_product_by_name", "product_name": "camiseta" }}

            Message: "I want a t-shirt"
            Response:
            {{ "intent": "get_product_by_name", "product_name": "t-shirt" }}

            Message: "Agrega el producto 123 al carrito"
            Response:
            {{ "intent": "add_to_cart", "product_id": "123", "quantity": 1 }}

            Message: "Quiero comprar una camiseta"
            Response:
            {{ "intent": "add_to_cart", "product_name": "camiseta", "quantity": 1 }}

            Message: "Add 2 t-shirts to my cart"
            Response:
            {{ "intent": "add_to_cart", "product_name": "t-shirt", "quantity": 2 }}

            Message: "Actualiza el carrito con 3 pantalones"
            Response:
            {{ "intent": "update_cart", "product_name": "pantalón", "quantity": 3 }}

            Message: "Update the cart with 1 jacket"
            Response:
            {{ "intent": "update_cart", "product_name": "jacket", "quantity": 1 }}

            Message: "Dame info del producto con ID 456"
            Response:
            {{ "intent": "get_product_by_id", "product_id": "456" }}

            Message: "Necesito ayuda con mi pedido anterior"
            Response:
            {{ "intent": "unknown" }}

            Now, extract the intent and details from this message:
            Message: "{message}"
            Response:
            """

        response = self.model.generate_content(prompt)
        raw_text = response.text
        
        print(f"Raw response: {raw_text}")
        
        cleaned_text = clean_response(raw_text)
        
        try:
            parsed = json.loads(cleaned_text)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse JSON response: {cleaned_text}") from e

        return parsed

    async def detect_intent(self, message: str) -> dict:
        loop = asyncio.get_running_loop()
        result = await loop.run_in_executor(None, self._detect_intent_sync, message)
        return result
