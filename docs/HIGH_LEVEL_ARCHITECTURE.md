# High-Level Architecture of the AI Agent

This document describes the overall architecture of the system implemented for the artificial intelligence agent that interacts with users to explore products and manage shopping carts.

---

## Main Components

### 1. **User Interface (Frontend)**

* **Technology**: Next.js + React + TailwindCSS  
* **Functionality**:
  * User-friendly chat interface  
  * Communicates with `/api/chat` (local API route)

### 2. **API Gateway (Next.js API Route)**

* **Route**: `/api/chat`  
* **Purpose**: Receives messages from the frontend and redirects them to the agent backend  
* **Details**:
  * Extracts `message` and `cart_id`  
  * Sends a `POST` request to the agent (`http://localhost:8000/chat`)

### 3. **AI Agent (FastAPI)**

* **Route**: `/chat`  
* **Responsibility**:
  * Detect user intent using an LLM (Gemini / OpenAI)  
  * Interact with the NestJS backend to retrieve products and manage carts

### 4. **LLM Service (Gemini / OpenAI)**

* **Purpose**: Detect the user's intent and entities in the message (product, quantity, etc.)

### 5. **NestJS API (Backend)**

* **Endpoints**:
  * `GET /products`  
  * `GET /products/:id`  
  * `GET /carts/:id` (User now can ask to ai agent to show the current cart)
  * `POST /carts`
  * `PATCH /carts/:id`
* **Purpose**: Provide access to product data and cart logic

### 6. **Database (Supabase / PostgreSQL)**

* Stores:
  * Products  
  * Carts and their items

---

## General Flow

1. The user writes a message.  
2. The frontend sends it to `/api/chat` along with the `cart_id` (if any).  
3. The API route forwards the message to the AI agent.  
4. The agent:
   * Detects intent (`get_products`, `add_to_cart`, `update_cart`, etc.)  
   * Calls the appropriate NestJS API endpoint  
   * Returns a response to the user and (optionally) a new `cart_id`
5. The frontend renders the response and updates the cart state.

---

## Considerations

* The agent handles `cart_id` in memory (no user sessions).  
* Intents are recognized via LLM and structured (e.g., `{ intent: 'add_to_cart', product_name: 't-shirt', quantity: 2 }`)

---

## General Diagram

```
[Frontend Chat UI] → [/api/chat] → [AI Agent] → [NestJS API] → [Supabase DB]
                         ↓
                     [LLM Service]
```