# Intelligent Shopping Assistant

This project implements a virtual assistant that allows users to interact with an online product catalog through natural language. It is designed to provide a more intuitive and user-friendly shopping experience by simulating a human-like conversation.

---

## What does the assistant do?

The assistant enables users to:

- Search for products by name or keyword
- View basic product details such as price and availability
- Add products to a shopping cart
- Modify the contents of the cart
- Continue shopping in an ongoing conversation without needing to repeat previous actions

For example, a user can simply type:

- "I want 2 t-shirts and 1 pair of pants"
- "Show me available jackets"
- "Add a black hoodie to my cart"

The assistant will understand the request and respond appropriately by retrieving products or updating the shopping cart.

---

## How does it work from a user perspective?

1. The user types a message in the chat interface.
2. The assistant interprets the message and determines the user's intent.
3. If the user wants to purchase something, the assistant creates a cart or updates an existing one.
4. The assistant replies with relevant product information or confirmation of actions taken.
5. The cart remains active for the duration of the conversation.

If the session is refreshed or closed, the assistant starts over, as the conversation context is stored only temporarily.

---

## Intended Use

This assistant is suitable for:

- E-commerce platforms seeking to enhance customer experience through conversational interfaces
- Businesses exploring AI-driven product discovery and cart management
- Demonstrations or pilots of natural language interaction in online retail environments

---

## Technical Documentation

For detailed implementation information, including system architecture, APIs, and integration, please refer to the [`/docs`](./docs) directory.

