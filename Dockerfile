# ==========================================
# Stage 1: Build the React Frontend
# ==========================================
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend

# Copy package manifests
COPY frontend/package.json frontend/package-lock.json* ./

# Install npm dependencies
RUN npm install

# Copy frontend source code and assets
COPY frontend/ ./

# Build production bundle into /app/frontend/dist
RUN npm run build

# ==========================================
# Stage 2: Production Python Backend + UI
# ==========================================
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for Pillow/OpenCV image processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies (CPU-optimized for Hugging Face Spaces free tier)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir tensorflow-cpu==2.16.2 && \
    pip install --no-cache-dir -r requirements.txt

# Create data directory for SQLite database
RUN mkdir -p /app/data && chmod 777 /app/data

# Copy backend code and models folder
COPY backend/ ./backend/
COPY models/ ./models/

# Copy built frontend dist from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Also copy frontend/public as metadata fallback
COPY frontend/public ./frontend/public

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    PORT=7860

# Hugging Face Spaces strictly routes traffic to port 7860
EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:7860/health || exit 1

# Start the unified FastAPI server
CMD ["uvicorn", "backend.backend:app", "--host", "0.0.0.0", "--port", "7860"]
