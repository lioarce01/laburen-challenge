from abc import ABC, abstractmethod

class LLMInterface(ABC):
    @abstractmethod
    async def detect_intent(self, message: str) -> str:
        """
        Detect the intent of a user message and return a keyword representing the intent.
        """
        pass
