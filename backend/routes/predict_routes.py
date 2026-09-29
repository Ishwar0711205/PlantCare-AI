import io
import numpy as np
from PIL import Image
from fastapi import APIRouter, File, Form, UploadFile, HTTPException, Depends
from ..services.inference import get_model, preprocess, MODEL_PATHS, CLASSES
from ..utils.auth import get_current_user

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/predict")
async def predict(
    image: UploadFile = File(...),
    model: str = Form("EfficientNetB0"),
):
    if model not in MODEL_PATHS:
        raise HTTPException(400, f"Model '{model}' unavailable. Choose from: {list(MODEL_PATHS.keys())}")
    
    data = await image.read()
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(413, "File too large. Maximum size is 10MB.")

    try:
        img = Image.open(io.BytesIO(data))
    except Exception:
        raise HTTPException(422, "Cannot read image. Send a valid JPG/PNG file.")

    try:
        m = get_model(model)
        x = preprocess(img, model, m)
        preds = m.predict(x, verbose=0)[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Inference error: {e}")

    idx  = int(np.argmax(preds))
    conf = float(preds[idx])

    top5_idx = np.argsort(preds)[::-1][:5]
    top5 = [{"class": CLASSES[int(i)], "confidence": float(preds[int(i)])} for i in top5_idx]

    return {"class": CLASSES[idx], "confidence": conf, "model": model, "top5": top5}
