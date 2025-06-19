"use client"

import { useState, useRef, useEffect } from "react"

export type Message = {
  from: "user" | "bot"
  text: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [cartId, setCartId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage() {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { from: "user", text: userMessage }])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, cart_id: cartId }),
      })

      const data = await res.json()

      if (data.cart_id) {
        setCartId(data.cart_id)
      }

      setMessages((prev) => [...prev, { from: "bot", text: data.response }])
    } catch {
      setMessages((prev) => [...prev, { from: "bot", text: "Error connecting to server." }])
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
