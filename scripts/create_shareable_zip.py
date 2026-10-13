import os
import zipfile
import sys
from pathlib import Path

def create_project_zip():
    root_dir = Path(r"c:\Users\ishwar\Desktop\dl project")
    desktop_dir = Path(os.path.expanduser("~/Desktop"))
    
    zip_output_desktop = desktop_dir / "PlantCare-AI-Project.zip"
    zip_output_local = root_dir / "PlantCare-AI-Project.zip"

    # Folders to completely ignore
    ignore_dirs = {
        "node_modules",
        "__pycache__",
        ".git",
        "New folder",
        "unhelathy_leaf",
        "streamlit",
        ".idea",
        ".vscode",
        "dist"
    }

    # Root files to ignore
    ignore_files = {
        "users.db",
        "run_streamlit.bat",
        "PlantCare-AI-Project.zip"
    }

    # Folders to explicitly include
    include_dirs = {
        "backend",
        "frontend",
        "models",
        "data",
        "scripts"
    }

    # Root files to explicitly include
    include_files = {
        "run.bat",
        ".env",
        ".env.example",
        "requirements.txt",
        "README.md",
        "Dockerfile",
        "app.py"
    }

    print("Creating clean shareable ZIP archive for PlantCare AI...")
    
    # We will write to a temp location first then copy to Desktop
    temp_zip = root_dir / "_temp_project.zip"
    if temp_zip.exists():
        temp_zip.unlink()

    total_files = 0
    total_bytes = 0

    with zipfile.ZipFile(temp_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        # 1. Add root files
        for f in include_files:
            file_path = root_dir / f
            if file_path.exists() and file_path.is_file():
                arcname = os.path.join("PlantCare-AI-Project", f)
                zf.write(file_path, arcname)
                total_files += 1
                total_bytes += file_path.stat().st_size
                print(f"  [+] Added root file: {f}")

        # 2. Add directories
        for d in include_dirs:
            dir_path = root_dir / d
            if not dir_path.exists():
                continue
            
            for folder_root, dirs, files in os.walk(dir_path):
                # Filter out ignored directories in-place
                dirs[:] = [sub for sub in dirs if sub not in ignore_dirs and not sub.startswith('.')]

                rel_folder = os.path.relpath(folder_root, root_dir)
                for file_name in files:
                    if file_name in ignore_files or file_name.endswith('.pyc') or file_name == "PlantCare-AI-Project.zip":
                        continue
                    
                    full_file_path = Path(folder_root) / file_name
                    arcname = os.path.join("PlantCare-AI-Project", rel_folder, file_name)
                    zf.write(full_file_path, arcname)
                    total_files += 1
                    total_bytes += full_file_path.stat().st_size

    # Move to Desktop and Root
    import shutil
    shutil.copy2(temp_zip, zip_output_desktop)
    shutil.copy2(temp_zip, zip_output_local)
    temp_zip.unlink()

    size_mb = zip_output_desktop.stat().st_size / (1024 * 1024)
    print("\n==================================================")
    print(f"[SUCCESS] Shareable ZIP file created successfully!")
    print(f"Files included : {total_files}")
    print(f"Uncompressed   : {total_bytes / (1024 * 1024):.2f} MB")
    print(f"Compressed ZIP : {size_mb:.2f} MB")
    print(f"\nZIP File Saved to Desktop:")
    print(f"  --> {zip_output_desktop}")
    print(f"ZIP File Saved to Project Root:")
    print(f"  --> {zip_output_local}")
    print("==================================================")

if __name__ == "__main__":
    create_project_zip()
