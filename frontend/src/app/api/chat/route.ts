import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, cart_id } = await request.json();

    const API_URL = process.env.AGENT_API_URL || 'http://localhost:8000';

    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, cart_id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ message: 'Agent error', error: errorText }, { status: 500 });
    }

    const data = await response.json();

    return NextResponse.json({ response: data.response, cart_id: data.cart_id ?? null });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
  }
}
