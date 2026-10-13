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

from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import HTTPException

# Include routes at root
app.include_router(auth_routes.router)
app.include_router(predict_routes.router)
app.include_router(history_routes.router)

# Also mount under /api prefix for transparent reverse-proxy and relative calls
app.include_router(auth_routes.router, prefix="/api")
app.include_router(predict_routes.router, prefix="/api")
app.include_router(history_routes.router, prefix="/api")

@app.get("/health")
@app.get("/api/health")
def health():
    from .services.inference import _cache
    return {
        "status": "ok",
        "available_models": list(MODEL_PATHS.keys()),
        "loaded_models": list(_cache.keys()),
        "num_classes": len(CLASSES),
    }

@app.get("/models")
@app.get("/api/models")
def models_list():
    return {"available": list(MODEL_PATHS.keys())}

# Locate built React frontend
DIST_DIR = Path(__file__).parent.parent / "frontend" / "dist"
if not DIST_DIR.exists():
    DIST_DIR = Path("/app/frontend/dist")

if DIST_DIR.exists() and (DIST_DIR / "index.html").exists():
    assets_dir = DIST_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/")
    async def serve_root():
        return FileResponse(DIST_DIR / "index.html")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Exclude backend API routes and documentation endpoints from SPA fallback
        reserved_prefixes = ("api/", "predict", "health", "models", "login", "signup", "history", "docs", "openapi.json", "redoc")
        if full_path.startswith(reserved_prefixes) or full_path in reserved_prefixes:
            raise HTTPException(404, detail="Not Found")

        target_file = DIST_DIR / full_path
        if full_path and target_file.is_file():
            return FileResponse(target_file)

        return FileResponse(DIST_DIR / "index.html")

