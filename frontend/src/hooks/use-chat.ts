"use client"

import { useState, useRef, useEffect } from "react"

export type Message = {
  from: "user" | "agent"
  text: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [cartId, setCartId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    console.log("Cart ID changed to:", cartId)
  }, [cartId])

  async function sendMessage() {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { from: "user", text: userMessage }])
    setInput("")
    setLoading(true)

    try {
      console.log("Sending request:")
      console.log("Message:", userMessage)
      console.log("Current cartId:", cartId)

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, cart_id: cartId }),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()

      console.log("Received response:")
      console.log("Response:", data.response)
      console.log("Received cart_id:", data.cart_id)
      console.log("Previous cart_id:", cartId)

      // Solo actualizar cartId si viene uno válido del backend
      if (data.cart_id !== undefined && data.cart_id !== null) {
        if (data.cart_id !== cartId) {
          console.log(`Updating cartId from ${cartId} to ${data.cart_id}`)
          setCartId(data.cart_id)
        } else {
          console.log("Cart ID unchanged")
        }
      } else {
        console.log("No cart_id in response")
      }

      setMessages((prev) => [...prev, { from: "agent", text: data.response }])
    } catch (error) {
      console.error("Error in sendMessage:", error)
      setMessages((prev) => [...prev, { from: "agent", text: "Error connecting to server." }])
    } finally {
      setLoading(false)
    }
  }

  return {
    messages,
    input,
    setInput,
    cartId,
    loading,
    messagesEndRef,
    sendMessage,
  }
}