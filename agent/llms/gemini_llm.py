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
            Your task is to detect the user's intent and extract relevant data in a **strict JSON format**.

            Always respond ONLY with valid JSON. No explanations.

            ### GENERAL FORMAT

            If the intent is "get_products", respond:
            {{ "intent": "get_products" }}

            If the intent is "get_product_by_name" or "get_product_by_id", respond:
            {{ "intent": "get_product_by_name", "product_name": "..." }}
            {{ "intent": "get_product_by_id", "product_id": "..." }}

            If the intent is "add_to_cart" or "update_cart", respond:
            {{
            "intent": "add_to_cart",
            "items": [
                {{ "product_name": "camiseta", "quantity": 2 }},
                {{ "product_name": "sudadera", "quantity": 1 }}
            ]
            }}
            
            If the intent is "get_cart", respond:
            You must include the cart items in the response
            {{ "intent": "get_cart", "cart_id": 123, "items": [...] }}
            

            If the intent is unknown, respond:
            {{ "intent": "unknown" }}

            ### RULES

            - Include only the relevant keys.
            - Use empty strings or zero values if necessary.
            - Always use a list of `items` for add_to_cart or update_cart, even if there's only one item.

            ### EXAMPLES

            Message: "Agregame 2 camisetas y 3 pantalones"
            Response:
            {{
            "intent": "add_to_cart",
            "items": [
                {{ "product_name": "camiseta", "quantity": 2 }},
                {{ "product_name": "pantalón", "quantity": 3 }}
            ]
            }}

            Message: "Update my cart with 1 t-shirt and 4 hoodies"
            Response:
            {{
            "intent": "update_cart",
            "items": [
                {{ "product_name": "t-shirt", "quantity": 1 }},
                {{ "product_name": "hoodie", "quantity": 4 }}
            ]
            }}

            Message: "Show me all products"
            Response:
            {{ "intent": "get_products" }}

            Message: "I want info about product ID 123"
            Response:
            {{ "intent": "get_product_by_id", "product_id": "123" }}

            Now extract the intent and details from this message:
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
