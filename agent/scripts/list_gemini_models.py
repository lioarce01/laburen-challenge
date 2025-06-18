import google.generativeai as genai
import os

API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=API_KEY)

print("Available Gemini Models:")
for model in genai.list_models():
    print("Model", model.name)
    print("   Methods:", model.supported_generation_methods)
