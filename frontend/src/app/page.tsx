'use client'
import { useState, useRef, useEffect } from 'react';

type Message = {
  from: 'user' | 'bot';
  text: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [cartId, setCartId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { from: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, cart_id: cartId }),
      });

      const data = await res.json();

      if (data.cart_id) {
        setCartId(data.cart_id);
      }

      setMessages((prev) => [...prev, { from: 'bot', text: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Error connecting to server.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 font-sans flex flex-col h-[600px]">
      <h1 className="text-2xl font-bold mb-4 text-center">Chat with AI</h1>

      <div className="flex-1 bg-gray-100 p-4 rounded-lg overflow-y-auto shadow-md whitespace-pre-wrap">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'
              }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] break-words ${msg.from === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-900 shadow'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading) sendMessage();
        }}
        className="mt-4 flex gap-2"
      >
        <input
          type="text"
          className="flex-grow rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-blue-600 disabled:bg-blue-300 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
