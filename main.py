from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("FastAPI uygulaması başlatılıyor...")
    yield
    print("fastapi kapanıyor.")


app = FastAPI(
    title=settings.PROJECT_NAME,  # config.py dosyasından proje adını çeker
    version="0.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,  # Yaşam döngüsü yöneticisini ekliyoruz
)


@app.get("/")
def say_hello():
    return {"message": "dernek erp CI/CD testi 23123"}


@app.get("/uye-listesi")
def get_uye_listesi():
    return {"message": "Üye listesi"}
