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
        
    async def close(self):
        """Close the LLM client if necessary"""
        pass

    def _detect_intent_sync(self, message: str) -> dict:
        prompt = f"""
            You are a smart, friendly assistant for an online shopping platform.

            You will receive user messages in Spanish or English. Answer in the same language as the user message.
            Your task is to detect the user's intent and extract relevant data in a **strict JSON format**, and also provide a humanized, conversational response for the user.
            
            Always respond ONLY with valid JSON. No explanations, no markdown, no code blocks.

            The JSON must have:
            - An 'intent' field (see below)
            - Any relevant fields (like 'product_name', 'items', etc.)
            - A 'message' field with a friendly, conversational reply for the user, based on their request and your understanding.

            ### GENERAL FORMAT

            If the intent is "get_products":
            {{ "intent": "get_products", "message": "Here are the products you can check out! Let me know if you want details about any of them." }}

            If the intent is "get_product_by_name" or "get_product_by_id":
            {{ "intent": "get_product_by_name", "product_name": "...", "message": "Here's what I found for {{product_name}}!" }}
            {{ "intent": "get_product_by_id", "product_id": "...", "message": "Here's the info for product ID {{product_id}}." }}

            If the intent is "add_to_cart" or "update_cart":
            {{
            "intent": "add_to_cart",
            "items": [
                {{ "product_name": "camiseta", "quantity": 2 }},
                {{ "product_name": "sudadera", "quantity": 1 }}
            ],
            "message": "I've added those items to your cart! Anything else you'd like?"
            }}
            
            If the intent is "get_cart":
            {{ "intent": "get_cart", "cart_id": 123, "items": [...], "message": "Here's your current cart!" }}
            
            If the intent is unknown:
            {{ "intent": "unknown", "message": "Sorry, I didn't quite get that. Could you rephrase?" }}

            ### RULES

            - Include only the relevant keys.
            - Use empty strings or zero values if necessary.
            - Always use a list of `items` for add_to_cart or update_cart, even if there's only one item.
            - The 'message' field should be a friendly, natural language response for the user.

            ### EXAMPLES

            Message: "Agregame 2 camisetas y 3 pantalones"
            Response:
            {{
            "intent": "add_to_cart",
            "items": [
                {{ "product_name": "camiseta", "quantity": 2 }},
                {{ "product_name": "pantalón", "quantity": 3 }}
            ],
            "message": "¡Listo! Agregué 2 camisetas y 3 pantalones a tu carrito. ¿Algo más?"
            }}

            Message: "Update my cart with 1 t-shirt and 4 hoodies"
            Response:
            {{
            "intent": "update_cart",
            "items": [
                {{ "product_name": "t-shirt", "quantity": 1 }},
                {{ "product_name": "hoodie", "quantity": 4 }}
            ],
            "message": "I've updated your cart with 1 t-shirt and 4 hoodies!"
            }}

            Message: "Show me all products"
            Response:
            {{ "intent": "get_products", "message": "Here are all the products we have!" }}

            Message: "I want info about product ID 123"
            Response:
            {{ "intent": "get_product_by_id", "product_id": "123", "message": "Here's the info for product ID 123." }}

            Now extract the intent, details, and generate a friendly message for this user message:
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
