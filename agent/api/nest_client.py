import httpx
from typing import List, Dict

class NestClient:
    def __init__(self, api_url: str):
        self.api_url = api_url
        self.client = httpx.AsyncClient(base_url=self.api_url, timeout=10.0)

    async def get_products(self) -> List[Dict]:
        response = await self.client.get("/products")
        response.raise_for_status()
        return response.json()

    async def search_products_by_name(self, name: str) -> list:
        url = f"{self.api_url}/products?q={name}"
        async with httpx.AsyncClient() as client:
            resp = await client.get(url)
            resp.raise_for_status()
            return resp.json()
    
    async def get_product_by_id(self, product_id: str) -> Dict:
        response = await self.client.get(f"/products/{product_id}")
        response.raise_for_status()
        return response.json()

    async def update_cart(self, cart_id: str, data: Dict) -> Dict:
        response = await self.client.patch(f"/carts/{cart_id}", json=data)
        response.raise_for_status()
        return response.json()
    
    async def create_cart(self, items: List[Dict]) -> Dict:
        response = await self.client.post("/carts", json={"items": items})
        response.raise_for_status()
        return response.json()

    async def close(self):
        await self.client.aclose()
