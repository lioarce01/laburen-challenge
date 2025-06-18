# Arquitectura de Alto Nivel del Agente de IA

Este documento describe la arquitectura general del sistema implementado para el agente de inteligencia artificial que interactúa con usuarios para explorar productos y gestionar carritos de compra.

---

## Componentes Principales

### 1. **Interfaz de Usuario (Frontend)**

* **Tecnología**: Next.js + React + TailwindCSS
* **Funcionalidad**:

  * Interfaz de chat amigable
  * Comunicación con `/api/chat` (API route local)

### 2. **API Gateway (Next.js API Route)**

* **Ruta**: `/api/chat`
* **Función**: Recibe mensajes del frontend y los redirige al backend del agente
* **Contenido**:

  * Extrae `message` y `cart_id`
  * Hace `POST` al agente (`http://localhost:8000/chat`)

### 3. **Agente de IA (FastAPI)**

* **Ruta**: `/chat`
* **Responsabilidad**:

  * Detectar el intent del usuario mediante LLM (Gemini / OpenAI)
  * Interactuar con el backend Nest.js para obtener productos y gestionar carritos

### 4. **LLM Service (Gemini / OpenAI)**

* **Función**: Detectar intención y entidades del mensaje del usuario (producto, cantidad, etc.)

### 5. **API NestJS (Backend)**

* **Endpoints**:

  * `GET /products`
  * `GET /products/:id`
  * `POST /carts`
  * `PATCH /carts/:id`
* **Función**: Proveer acceso a productos y lógica de carrito

### 6. **Base de Datos (Supabase / PostgreSQL)**

* Almacena:

  * Productos
  * Carritos y sus ítems

---

## Flujo General

1. Usuario escribe un mensaje.
2. El frontend lo envía a `/api/chat` junto al `cart_id` (si existe).
3. El API route reenvía el mensaje al agente de IA.
4. El agente:

   * Detecta intención (`get_products`, `add_to_cart`, `update_cart`, etc.)
   * Llama a la API Nest según el caso
   * Devuelve respuesta al usuario y (opcionalmente) un nuevo `cart_id`
5. El frontend renderiza la respuesta y actualiza el estado del carrito.

---

## Consideraciones

* El agente maneja el `cart_id` en memoria (no hay sesiones).
* Los intents son reconocidos vía LLM y están estructurados (ej: `{ intent: 'add_to_cart', product_name: 'camiseta', quantity: 2 }`)

---

## Diagrama General (Ver imagen `architecture.png`)

```
[Frontend Chat UI] → [/api/chat] → [Agente IA] → [NestJS API] → [Supabase DB]
                         ↓
                     [LLM Service]
```