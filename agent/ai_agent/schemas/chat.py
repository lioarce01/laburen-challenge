from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    cart_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    cart_id: Optional[int] = None