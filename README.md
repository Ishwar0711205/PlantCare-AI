# PlantCare AI

An AI-powered agricultural tool designed to detect plant leaf diseases using Deep Learning. It classifies uploaded leaf images into one of 38 classes (from the PlantVillage dataset) and provides disease symptoms, prevention steps, and spray/treatment guidance. 

## Features
- **38-Class Detection**: Identifies diseases across multiple crops like Tomato, Potato, Apple, Corn, Grapes, and more.
- **5 Deep Learning Models**: Choose from Custom CNN, VGG16, MobileNetV2, ResNet50, and EfficientNetB0 for inference.
- **Multilingual Support**: Disease symptoms, what-to-do guidance, and spray/active-ingredient guidance provided in **English, Hindi, and Marathi**.
- **Modern Web App**: A beautiful, responsive React frontend UI served by a fast FastAPI backend.
- **Standalone App**: A legacy Streamlit app is also included for quick, all-in-one local testing.
- **Healthy Plants Gallery**: A reference tab for identifying healthy crop leaves.

## Project Structure
The repository is structured to separate concerns while sharing a single source of truth for data:
- `frontend/`: Contains the React + Vite frontend application.
  - `frontend/public/`: Acts as the data source for both the frontend and backend. Contains `class_names.json`, `plant_info.json`, `model_results.json`, and the `healthy_images/` directory.
- `models/`: Contains the compiled `.keras` deep learning models and their training metadata.
- `backend.py`: The FastAPI server that handles inference and user authentication.
- `app.py`: The standalone Streamlit UI.
- `users.db`: SQLite database for handling local login/signup.

## How to Run

### Option 1: Full Stack (React + FastAPI)
This is the recommended way to run the full application.
1. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```
2. Install Frontend requirements:
   ```bash
   cd frontend
   npm install
   cd ..
   ```
3. Start both services using the provided batch script:
   ```bash
   .\run.bat
   ```
   *The backend will be available at `http://localhost:8000` and the frontend UI at `http://localhost:5173`.*

### Option 2: Standalone Streamlit App
If you prefer a simpler, single-script interface:
1. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the Streamlit app using the provided batch script:
   ```bash
   .\run_streamlit.bat
   ```

## Important Treatment Note
Spray guidance is deliberately written as active-ingredient/category guidance, not a prescription. Product registration, crop label, formulation, dose, pre-harvest interval, PPE and local restrictions must be checked before use. The AI prediction is a screening aid, not a laboratory diagnosis.
