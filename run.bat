@echo off
echo =============================================
echo  PlantCare AI - Starting all services
echo =============================================
echo.
echo [1/2] Starting FastAPI backend on port 8000...
start "FastAPI Backend" cmd /k "cd /d "%~dp0" && uvicorn backend.backend:app --host 0.0.0.0 --port 8000"
echo.
timeout /t 3 /nobreak >nul
echo [2/2] Starting React frontend on port 5173...
start "React Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev -- --host"
echo.
echo Both services started!
echo   Backend API: http://localhost:8000
echo   Frontend UI: http://localhost:5173
echo   API Health:  http://localhost:8000/health
echo.
pause
