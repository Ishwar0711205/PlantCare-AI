from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database.db import init_db
from .services.inference import get_model, MODEL_PATHS, CLASSES
from .routes import auth_routes, predict_routes, history_routes

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB
    init_db()
    
    # Pre-warm smallest model so first request is fast
    warmup = "EfficientNetB0" if "EfficientNetB0" in MODEL_PATHS else (list(MODEL_PATHS.keys()) or [None])[0]
    if warmup:
        try:
            get_model(warmup)
        except Exception as e:
            print(f"[PlantCare] Pre-warm skipped: {e}")
    yield

app = FastAPI(title="PlantCare AI API", version="1.0.0", lifespan=lifespan)

# Allow all origins for local dev/MVP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(predict_routes.router)
app.include_router(history_routes.router)

@app.get("/health")
def health():
    from .services.inference import _cache
    return {
        "status": "ok",
        "available_models": list(MODEL_PATHS.keys()),
        "loaded_models": list(_cache.keys()),
        "num_classes": len(CLASSES),
    }

@app.get("/models")
def models_list():
    return {"available": list(MODEL_PATHS.keys())}
