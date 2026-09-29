import gradio as gr
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import your existing FastAPI application
from backend.backend import app as fastapi_app

# Hugging Face Spaces with Gradio SDK requires a Gradio interface.
# We create a simple dummy interface and mount your real FastAPI app to it!
def greet(name):
    return "PlantCare AI Backend is running!"

demo = gr.Interface(fn=greet, inputs="text", outputs="text")

# Mount Gradio onto your FastAPI app
app = gr.mount_gradio_app(fastapi_app, demo, path="/gradio")

# HF Spaces run on port 7860 by default
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
