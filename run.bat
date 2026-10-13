@echo off
echo =============================================
echo  PlantCare AI - Starting all services
echo =============================================
echo.

set ROOT=%~dp0

REM --- Auto-setup: create data folder if missing ---
if not exist "%~dp0data" (
    echo [SETUP] Creating data\ folder...
    mkdir "%~dp0data"
)

REM --- Auto-setup: create .env from .env.example if missing ---
if not exist "%~dp0.env" (
    echo [SETUP] No .env found - copying from .env.example...
    copy "%~dp0.env.example" "%~dp0.env" >nul
    echo [SETUP] .env file created. Edit it if needed.
)

REM --- Auto-setup: install frontend dependencies if missing ---
if not exist "%~dp0frontend\node_modules" (
    echo [SETUP] Installing frontend npm packages (first time only)...
    cd /d "%~dp0frontend"
    npm install
    cd /d "%~dp0"
)

echo.
echo [1/2] Starting FastAPI backend on port 8000...
start "FastAPI Backend" cmd /k "cd /d %ROOT% && python -m uvicorn backend.backend:app --host 0.0.0.0 --port 8000"
echo.
timeout /t 3 /nobreak >nul
echo [2/2] Starting React frontend on port 5173...
start "React Frontend" cmd /k "cd /d %ROOT%frontend && npm run dev -- --host"
echo.
echo Both services started!
echo   Backend API: http://localhost:8000
echo   Frontend UI: http://localhost:5173
echo   API Health:  http://localhost:8000/health
echo.
pause
