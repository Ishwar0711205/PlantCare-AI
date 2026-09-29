import requests
import sys
import time

URL = "http://localhost:8000/predict/"
MODELS = ["CNN", "ResNet50", "EfficientNetB0", "MobileNetV2", "VGG16"]
IMAGE_PATH = r"C:\Users\ishwar\Desktop\dl project\frontend\public\healthy_images\Tomato_healthy.png"

# Wait for server
while True:
    try:
        requests.get("http://localhost:8000/health")
        break
    except:
        time.sleep(1)

for model in MODELS:
    print(f"Testing {model}...")
    try:
        with open(IMAGE_PATH, 'rb') as f:
            files = {'image': ('Tomato_healthy.png', f, 'image/png')}
            data = {'model': model}
            response = requests.post(URL, files=files, data=data)
            
            if response.status_code == 200:
                print(f"  [SUCCESS] {response.json()}")
            else:
                print(f"  [ERROR {response.status_code}] {response.text}")
    except Exception as e:
        print(f"  [EXCEPTION] {e}")
print("Test completed.")
