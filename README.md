# PlantCare AI — Plant Leaf Disease Detection System

An AI-powered agricultural application for detecting plant leaf diseases across **38 crop condition classes** using **5 Deep Learning model architectures** (Custom CNN, EfficientNetB0, MobileNetV2, ResNet50, VGG16) with **multilingual support** (English, Hindi, Marathi) and **Devanagari numeral formatting**.

---

## 📌 Academic Information
- **Institution**: Vidyalankar Institute of Technology
- **Department**: Department of Information Technology (Academic Year 2026–27)
- **Project Title**: Plant Disease Classification Using Deep Learning
- **Team Members**: Vinay Yadav, Akash Misale, Jay Jangam, Ishwar Garje
- **Project Guide**: Dr. Sushopti Gawade

---

## ⚡ Quick Start (1-Click Run)

To run the complete system (FastAPI Backend + React Frontend):

```cmd
run.bat
```

> **`run.bat` auto-configures everything:**
> - Auto-creates `data/` directory and `.env` file from `.env.example`.
> - Checks and installs `npm` dependencies if `node_modules` is missing.
> - Starts FastAPI backend on `http://localhost:8000`.
> - Starts React Vite frontend on `http://localhost:5173` (or `5174`).

---

## 📚 Complete Command Reference & Documentation

For full architectural details, manual terminal commands, API endpoints, troubleshooting guide, and Kaggle dataset commands, read the full guide:

➡️ **[PROJECT_GUIDE.md](file:///c:/Users/ishwar/Desktop/dl%20project/PROJECT_GUIDE.md)**

---

## 💻 Essential Terminal Commands

### 1. Run Backend Only (FastAPI)
```cmd
python -m uvicorn backend.backend:app --host 0.0.0.0 --port 8000 --reload
```
- Swagger API Docs: `http://localhost:8000/docs`

### 2. Run Frontend Only (React + Vite)
```cmd
cd frontend
npm install
npm run dev -- --host
```

### 3. Create Shareable ZIP for WhatsApp / Email
```cmd
python scripts/create_shareable_zip.py
```
- Output ZIP: `C:\Users\ishwar\Desktop\PlantCare-AI-Project.zip` (~511 MB)

### 4. Download Full Kaggle Dataset
Place `kaggle.json` in project root and run:
```cmd
python scripts/setup_plantvillage_images.py
```

## 🧠 Model Weights & Dataset Downloads

Because trained deep learning weights (`*.keras`, `*.h5`) and the full dataset are large binary files, they are excluded from the git repository via `.gitignore`:
- **Trained Models (`models/`)**: Place the trained model files (`CNN.keras`, `EfficientNetB0.keras`, `MobileNetV2.keras`, `ResNet50.keras`, `VGG16.keras`) in the `models/` folder. If you downloaded the bundled release archive (`PlantCare-AI-Project.zip`), these weights are pre-included. Alternatively, download model weights from your team's Google Drive / Hugging Face repository.
- **PlantVillage Dataset**: The models are trained on the 38-class PlantVillage dataset (~54,305 leaf images). Download it from [Kaggle: PlantVillage Dataset](https://www.kaggle.com/datasets/emmarex/plantvillage-dataset) or run `python scripts/setup_plantvillage_images.py` with your `kaggle.json`.

---

## ⚠️ Sharing Instructions for Friends

When sharing `PlantCare-AI-Project.zip` with friends:
1. They extract `PlantCare-AI-Project.zip`.
2. Double-click `run.bat` (it automatically installs dependencies and starts the app).
3. Open `http://localhost:5173` in their browser and click **Sign Up** to create their own local account.

---

© 2026 Vidyalankar Institute of Technology. Department of Information Technology.
