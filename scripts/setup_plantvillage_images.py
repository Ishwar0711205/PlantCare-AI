import os
import sys
import shutil
import subprocess

def setup_kaggle_json():
    home = os.path.expanduser("~")
    kaggle_dir = os.path.join(home, ".kaggle")
    kaggle_json_path = os.path.join(kaggle_dir, "kaggle.json")
    local_kaggle_json = os.path.abspath("kaggle.json")

    os.makedirs(kaggle_dir, exist_ok=True)

    if os.path.exists(local_kaggle_json):
        shutil.copy(local_kaggle_json, kaggle_json_path)
        print(f"[OK] Copied {local_kaggle_json} -> {kaggle_json_path}")
    
    if not os.path.exists(kaggle_json_path):
        print("[!] ERROR: kaggle.json not found in ~/.kaggle/ or project root!")
        print("    Please place your kaggle.json file at: c:\\Users\\ishwar\\Desktop\\dl project\\kaggle.json")
        return False
    
    print("[OK] kaggle.json detected successfully.")
    return True

def install_kaggle():
    try:
        import kaggle
        print("[OK] Kaggle package is installed.")
    except ImportError:
        print("[...] Installing kaggle package...")
        subprocess.run([sys.executable, "-m", "pip", "install", "kaggle"], check=True)

def download_and_extract_images():
    if not setup_kaggle_json():
        return

    install_kaggle()

    import zipfile
    from kaggle.api.kaggle_api_extended import KaggleApi

    api = KaggleApi()
    api.authenticate()

    print("[...] Downloading PlantVillage dataset from Kaggle...")
    dataset_name = "abdallahalidev/plantvillage-dataset"
    download_dir = os.path.abspath("data/kaggle_dataset")
    os.makedirs(download_dir, exist_ok=True)

    api.dataset_download_files(dataset_name, path=download_dir, unzip=True)
    print("[OK] Dataset downloaded and unzipped successfully.")

    target_dir = os.path.abspath("frontend/public/disease_images")
    os.makedirs(target_dir, exist_ok=True)

    color_dir = None
    for root, dirs, files in os.walk(download_dir):
        if os.path.basename(root).lower() == "color" or "plantvillage" in os.path.basename(root).lower():
            color_dir = root
            break

    if not color_dir:
        color_dir = download_dir

    count = 0
    for root, dirs, files in os.walk(color_dir):
        folder_name = os.path.basename(root)
        image_files = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        if image_files:
            sample_img = image_files[0]
            src = os.path.join(root, sample_img)
            dst = os.path.join(target_dir, f"{folder_name}.jpg")
            shutil.copy(src, dst)
            count += 1
            print(f"  [+] Copied sample image for [{folder_name}] -> {dst}")

    print(f"\n[OK] Successfully populated {count} leaf images in frontend/public/disease_images/")

if __name__ == "__main__":
    download_and_extract_images()
