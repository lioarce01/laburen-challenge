from pydantic import BaseSettings, AnyHttpUrl

class Settings(BaseSettings):
    openai_api_key: str
    google_api_key: str
    api_url: AnyHttpUrl

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
