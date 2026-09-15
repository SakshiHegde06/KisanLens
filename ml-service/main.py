from fastapi import FastAPI

from app.routers import crop, disease, soil

app = FastAPI(title="KisanLens ML Service")

app.include_router(soil.router)
app.include_router(disease.router)
app.include_router(crop.router)


@app.get("/health")
def health():
    return {"status": "ok"}
