# AI Agent Flow Design

This document describes the logical interaction flow between the user and the AI agent for exploring products, creating a cart, and modifying it.

---

## 1. Product Exploration

**Scenario:** The user wants to see available products or search for a specific one.

```
User → "What products are available?"
    ↓
Frontend → local API (/api/chat)
    ↓
AI Agent detect intent: get_products
    ↓
Agent calls Nest API: GET /products
    ↓
Nest answer with a list
    ↓
Agent answer with products names to the user
```

**Alternative:**

```
User → "I want to see the sports t-shirt"
↓
Agent detects: get_product_by_name
↓
Nest: GET /products?name=sports t-shirt
```

---

## 2. Create Cart

**Scenario:** The user requests to add a product to the cart.

```
User → "Add 2 t-shirts to the cart"
↓
Agent detects: add_to_cart
↓
Looks up product → GET /products?name=t-shirt
↓
No cart exists → POST /carts with items
↓
Stores cart_id in memory
↓
Replies to the user with confirmation and subtotal
```

---

## 3. Edit Cart (optional)

**Scenario:** The user wants to change the quantity of a product in their cart.

```
User → "Update the cart with 5 t-shirts"
↓
Agent detects: update_cart
↓
Checks active cart_id
↓
Looks up product → GET /products?name=t-shirt
↓
PATCH /carts/:id with new quantity
↓
Replies with updated subtotal
```

---

## Considerations

* The agent stores `cart_id` in memory (by prop).
* If the frontend is refreshed, the `cart_id` is passed again.
* If no cart exists, `update_cart` responds that there is no active cart.