# Diseño del Flujo del Agente de IA

Este documento describe el flujo lógico de interacción entre el usuario y el agente de inteligencia artificial para explorar productos, crear un carrito y modificarlo.

---

## 1. Exploración de Productos

**Escenario:** Usuario quiere conocer productos disponibles o buscar uno en particular.

```
Usuario → "Qué productos hay disponibles?"
    ↓
Frontend → API local (/api/chat)
    ↓
Agente IA detecta intent: get_products
    ↓
Agente llama a Nest: GET /products
    ↓
Nest responde con lista
    ↓
Agente responde al usuario con los nombres
```

**Alternativa:**

```
Usuario → "Quiero ver la camiseta deportiva"
    ↓
Agente detecta: get_product_by_name
    ↓
Nest: GET /products?name=camiseta deportiva
```

---

## 2. Crear Carrito

**Escenario:** Usuario pide agregar un producto al carrito.

```
Usuario → "Agrega 2 camisetas al carrito"
    ↓
Agente detecta: add_to_cart
    ↓
Busca producto → GET /products?name=camiseta
    ↓
No hay carrito → POST /carts con items
    ↓
Guarda cart_id en memoria
    ↓
Responde al usuario con confirmación y subtotal
```

---

## 3. Editar Carrito (opcional)

**Escenario:** Usuario desea cambiar cantidad de un producto en su carrito.

```
Usuario → "Actualiza el carrito con 5 camisetas"
    ↓
Agente detecta: update_cart
    ↓
Verifica cart_id activo
    ↓
Busca producto → GET /products?name=camiseta
    ↓
PATCH /carts/:id con nuevos qty
    ↓
Responde con actualización del subtotal
```

---

## Consideraciones

* El agente guarda el `cart_id` en memoria (por prop).
* Si se refresca el frontend, el `cart_id` se pasa nuevamente.
* Si no hay carrito, `update_cart` responde que no hay carrito activo.