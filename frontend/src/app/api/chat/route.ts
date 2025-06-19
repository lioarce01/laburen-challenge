import { NextRequest, NextResponse } from 'next/server';

async function pingBackend() {
  try {
    const res = await fetch(`${process.env.AGENT_API_URL}/health`)
    return res.ok
  } catch (e) {
    console.error("Ping failed:", e)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, cart_id } = await request.json();

    const backendIsUp = await pingBackend()
    if (!backendIsUp) {
      console.warn("Backend might be down or cold start")
      return NextResponse.json({ message: 'Backend is down or cold start', error: 'Backend unavailable' }, { status: 503 });
    }

    console.log("Next.js API received:")
    console.log("Message:", message)
    console.log("Cart ID:", cart_id)
    console.log("Cart ID type:", typeof cart_id)

    const API_URL = process.env.AGENT_API_URL || 'https://laburen-challenge.onrender.com';

    const requestBody = { message, cart_id };
    console.log("Sending to Python agent:", requestBody)

    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Agent error:", errorText)
      return NextResponse.json({ message: 'Agent error', error: errorText }, { status: 500 });
    }

    const data = await response.json();

    console.log("Python agent response:")
    console.log("Response:", data.response)
    console.log("Cart ID:", data.cart_id)
    console.log("Cart ID type:", typeof data.cart_id)

    return NextResponse.json({
      response: data.response,
      cart_id: data.cart_id ?? null
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
  }
}