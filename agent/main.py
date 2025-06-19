from fastapi import FastAPI, Body, Form
from fastapi.responses import PlainTextResponse, JSONResponse
from ai_agent.services.agent_service import AgentService
from ai_agent.schemas.chat import ChatRequest, ChatResponse

app = FastAPI()
agent = AgentService()

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    agent = AgentService()
    return await agent.handle_user_message(
        message=payload.message, 
        cart_id=payload.cart_id
    )
    
@app.get("/health", response_class=PlainTextResponse)
async def health_check():
    return JSONResponse(content={"status": "ok"}, status_code=200)

@app.on_event("shutdown")
async def shutdown_event():
    await agent.close()