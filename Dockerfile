FROM python:3.10-slim

WORKDIR /app

# Install system dependencies needed for image processing
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ ./backend/
COPY models/ ./models/

# Hugging Face Spaces strictly routes traffic to port 7860
EXPOSE 7860

# Start the FastAPI server on port 7860
CMD ["uvicorn", "backend.backend:app", "--host", "0.0.0.0", "--port", "7860"]
