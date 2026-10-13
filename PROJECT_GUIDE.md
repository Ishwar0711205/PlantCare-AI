# PlantCare AI — Full Project Guide & Command Documentation

Welcome to **PlantCare AI**, an AI-powered Deep Learning application for plant leaf disease detection across 38 crop condition classes using 5 deep learning model architectures with multilingual support (English, Hindi, Marathi).

---

## 📌 Academic Metadata
- **Institution**: Vidyalankar Institute of Technology
- **Department**: Department of Information Technology (Academic Year 2026–27)
- **Project Title**: Plant Disease Classification Using Deep Learning
- **Team Members**: Vinay Yadav, Akash Misale, Jay Jangam, Ishwar Garje
- **Project Guide**: Dr. Sushopti Gawade

---

## 🚀 Quick Start (1-Click Launch)

To start both the **FastAPI Backend** and **React Frontend** automatically:

```cmd
run.bat
```

> **What `run.bat` does automatically:**
> 1. Verifies Python & Node.js installation.
> 2. Auto-creates `data/` directory and `.env` file from `.env.example`.
> 3. Checks if `frontend/node_modules` exists; if missing, runs `npm install`.
> 4. Launches FastAPI Backend on `http://localhost:8000`.
> 5. Launches React Vite Frontend on `http://localhost:5173` (or `5174`).

---

## 📋 System Prerequisites & Requirements

### Minimum Software Requirements
- **Operating System**: Windows 10/11 (or Linux / macOS)
- **Python**: Version `3.10.x` or `3.11.x`
- **Node.js**: Version `18.x` or higher
- **npm**: Version `9.x` or higher

### Python Dependencies (`requirements.txt`)
```text
fastapi>=0.110.0
uvicorn[standard]>=0.28.0
tensorflow>=2.16.1
pillow>=10.2.0
python-multipart>=0.0.9
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
requests>=2.31.0
protobuf>=3.20.3,<5.0.0
```

---

## 💻 Complete Command Guide

### 1. Manual Backend Start (FastAPI)
Run from the root project directory (`c:\Users\ishwar\Desktop\dl project`):

```cmd
python -m uvicorn backend.backend:app --host 0.0.0.0 --port 8000 --reload
```
- **Backend API Base**: `http://localhost:8000`
- **Swagger Interactive API Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

---

### 2. Manual Frontend Start (React + Vite)
Open a new terminal window, navigate to the `frontend/` directory:

```cmd
cd frontend
npm install
npm run dev -- --host
```
- **Frontend App URL**: `http://localhost:5173` (or `http://localhost:5174`)

---

### 3. Build Frontend for Production
To generate an optimized production bundle in `frontend/dist/`:

```cmd
cd frontend
npm run build
```

---

### 4. Create Shareable ZIP for WhatsApp / Email
To generate a clean ~500 MB ZIP archive containing all models, frontend, backend, and dataset images (excluding `node_modules`):

```cmd
python scripts/create_shareable_zip.py
```
- **Output ZIP location**: `C:\Users\ishwar\Desktop\PlantCare-AI-Project.zip`

---

### 5. Download Kaggle Dataset (PlantVillage)
If you want to download the full 2.18 GB PlantVillage dataset from Kaggle:
1. Place your `kaggle.json` API key in `c:\Users\ishwar\Desktop\dl project\kaggle.json`.
2. Run the setup script:

```cmd
python scripts/setup_plantvillage_images.py
```

---

## 🏗️ Project Architecture & Directory Structure

```text
c:\Users\ishwar\Desktop\dl project\
├── run.bat                          # 1-Click Launcher (Backend + Frontend)
├── .env                             # Environment Variables (JWT Secret, DB Path, CORS)
├── .env.example                     # Environment Configuration Template
├── requirements.txt                 # Backend Python Dependencies
├── README.md                        # Primary Documentation
├── PROJECT_GUIDE.md                 # Complete Command & Architecture Guide
├── Dockerfile                       # Container Deployment Spec
├── app.py                           # Gradio / HuggingFace Spaces Deployment Wrapper
│
├── backend/                         # FastAPI Backend Core
│   ├── backend.py                   # Main FastAPI Entry Point & CORS Setup
│   ├── model_utils.py               # Keras 3 Model Loader & Compatibility Bridge
│   ├── database/
│   │   └── db.py                    # SQLite Database Manager (data/users.db)
│   ├── routes/
│   │   ├── auth_routes.py           # Signup (/signup), Login (/login), User Me (/me)
│   │   ├── predict_routes.py        # Image Analysis (/predict/)
│   │   └── history_routes.py        # User History Logging (/history/)
│   ├── services/
│   │   └── inference.py             # Preprocessing & Model Prediction Engine
│   └── utils/
│       └── auth.py                  # JWT Token Handling & Password Hashing
│
├── frontend/                        # React + Vite Frontend App
│   ├── package.json                 # Frontend Dependencies & Scripts
│   ├── vite.config.js               # Vite Configuration
│   ├── public/
│   │   ├── class_names.json         # 38 Supported Plant Condition Class Names
│   │   ├── plant_info.json          # Multilingual Symptoms & Care Guidance
│   │   ├── healthy_images/          # 12 Healthy Crop Leaf Photographs
│   │   └── disease_images/          # 26 Unhealthy Disease Leaf Photographs
│   └── src/
│       ├── context/
│       │   ├── AuthContext.jsx      # Authentication & User Session Manager
│       │   └── LanguageContext.jsx  # Language Switcher & Devanagari Digit Engine (en, hi, mr)
│       ├── pages/                   # All Application Pages
│       └── components/              # Reusable UI Components
│
├── models/                          # Trained Deep Learning Models
│   ├── CNN.keras                    # Custom CNN Architecture
│   ├── EfficientNetB0.keras         # EfficientNetB0 Transfer Model
│   ├── MobileNetV2.keras            # MobileNetV2 Transfer Model
│   ├── ResNet50.keras               # ResNet50 Transfer Model
│   └── VGG16.keras                  # VGG16 Transfer Model
│
├── data/                            # Active SQLite Database Storage
│   └── users.db                     # User Accounts & Prediction History Database
│
└── scripts/                         # Helper Scripts
    ├── setup_plantvillage_images.py # Kaggle Dataset Downloader
    └── create_shareable_zip.py      # Automated Project ZIP Packager
```

---

## 🔗 API Endpoint Reference

| HTTP Method | Path | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Health Check Endpoint | None |
| `POST` | `/signup` | Register new user account | None |
| `POST` | `/login` | Authenticate user & issue JWT token | None |
| `GET` | `/me` | Get active user profile | Bearer Token |
| `POST` | `/predict/` | Upload leaf image & get disease prediction | Optional Bearer |
| `GET` | `/history/` | Fetch user prediction history | Bearer Token |
| `DELETE` | `/history/` | Clear user prediction history | Bearer Token |

---

## 🌐 Multilingual Support & Devanagari Digits

PlantCare AI supports **English (`en`)**, **Hindi (`hi`)**, and **Marathi (`mr`)**.

When switched to Hindi or Marathi:
- Text descriptions, symptoms, guidance, labels, and headings switch to Hindi/Marathi.
- Numbers, metrics, percentages ($94.6\% \rightarrow ९४.६\%$), image counts ($162,916 \rightarrow १६२,९१६$), step indicators, and dates automatically format using Devanagari digits (`०, १, २, ३, ४, ५, ६, ७, ८, ९`).

---

## 🛡️ Troubleshooting & FAQs

### 1. SQLite Threading Error (`ProgrammingError: SQLite objects created in a thread...`)
- **Fix Applied**: `check_same_thread=False` is set on all SQLite connection handlers in [`backend/database/db.py`](file:///c:/Users/ishwar/Desktop/dl%20project/backend/database/db.py).

### 2. Protobuf Version Conflicts
- **Fix Applied**: Protobuf version is constrained to `protobuf>=3.20.3,<5.0.0` in `requirements.txt` to maintain compatibility with TensorFlow 2.16+.

### 3. Port `8000` or `5173` Already in Use
- To free port `8000` on Windows CMD:
  ```cmd
  netstat -ano | findstr :8000
  taskkill /PID <PID_NUMBER> /F
  ```

---

© 2026 Vidyalankar Institute of Technology — Department of Information Technology.
