"""
PlantCare AI — Automated Hugging Face Spaces Deployment Script
Uploads the complete unified project (FastAPI backend + React frontend + Keras models)
directly to a Hugging Face Space using the huggingface_hub library.
"""

import os
import sys
import argparse
from pathlib import Path
from huggingface_hub import HfApi, create_repo

ROOT = Path(__file__).resolve().parent.parent
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def main():
    parser = argparse.ArgumentParser(description="Deploy PlantCare AI to Hugging Face Spaces")
    parser.add_argument("--token", help="Hugging Face Write Token", default=None)
    parser.add_argument("--space", help="Target Space ID", default=None)
    args = parser.parse_args()

    print("=" * 65)
    print("  🌿 PlantCare AI — Hugging Face Spaces Deployment Utility")
    print("=" * 65)
    print()

    # 1. Hugging Face Token
    token = args.token or os.getenv("HF_TOKEN")
    if not token:
        print("Tip: You can get your Hugging Face write token at:")
        print("https://huggingface.co/settings/tokens (Select 'Write' permission)")
        print()
        token = input("Enter your Hugging Face Write Token: ").strip()

    if not token:
        print("❌ Error: Hugging Face Token is required.")
        sys.exit(1)

    api = HfApi(token=token)

    # 2. Verify Token & get username
    try:
        user_info = api.whoami()
        username = user_info["name"]
        print(f"✅ Authenticated as Hugging Face user: {username}")
    except Exception as e:
        print(f"❌ Authentication failed: {e}")
        sys.exit(1)

    # Check existing spaces for user
    existing_spaces = [s.id for s in api.list_spaces(author=username)]
    default_space_id = args.space
    if not default_space_id:
        if f"{username}/PlantCare-Backend" in existing_spaces:
            default_space_id = f"{username}/PlantCare-Backend"
        elif f"{username}/PlantCare-AI" in existing_spaces:
            default_space_id = f"{username}/PlantCare-AI"
        else:
            default_space_id = f"{username}/PlantCare-AI"

    if not args.space:
        space_id_input = input(f"Enter Space Repository ID (default: {default_space_id}): ").strip()
        repo_id = space_id_input if space_id_input else default_space_id
    else:
        repo_id = args.space

    print(f"\n📦 Target Hugging Face Space: {repo_id}")

    # 3. Create Space if it doesn't exist
    if repo_id not in existing_spaces:
        try:
            print("⏳ Checking/creating Hugging Face Space...")
            create_repo(
                repo_id=repo_id,
                repo_type="space",
                space_sdk="gradio",
                private=False,
                token=token,
                exist_ok=True,
            )
            print("✅ Space repository ready.")
        except Exception as e:
            print(f"⚠️ Note during repo creation: {e}")
    else:
        print(f"✅ Using existing Space: {repo_id}")

    # 4. Check model weights
    models_dir = ROOT / "models"
    keras_models = list(models_dir.glob("*.keras")) + list(models_dir.glob("*/*.keras"))
    print(f"\n🧠 Found {len(keras_models)} model file(s) in models/ directory:")
    for m in keras_models:
        size_mb = m.stat().st_size / (1024 * 1024)
        print(f"   - {m.name} ({size_mb:.1f} MB)")

    # 5. Check frontend build
    dist_dir = ROOT / "frontend" / "dist"
    if not dist_dir.exists() or not (dist_dir / "index.html").exists():
        print("\n⚠️ Note: frontend/dist not found. Building React frontend...")
        import subprocess
        subprocess.run(["npm", "run", "build"], cwd=str(ROOT / "frontend"), shell=True)

    # 6. Upload
    print("\n🚀 Uploading project files and model weights to Hugging Face...")
    print("   (Large .keras files are uploaded automatically via Git LFS)")
    
    ignore_patterns = [
        ".git/*",
        ".venv/*",
        "venv/*",
        "__pycache__/*",
        "node_modules/*",
        "frontend/node_modules/*",
        "data/*.db",
        "users.db",
        "*.zip",
        "kaggle.json",
        ".env",
        "unhelathy_leaf/*",
        "New folder/*",
        "*.log",
    ]

    try:
        api.upload_folder(
            folder_path=str(ROOT),
            repo_id=repo_id,
            repo_type="space",
            ignore_patterns=ignore_patterns,
            commit_message="Deploy PlantCare AI (Unified React Frontend + FastAPI + Models)",
        )
        print("\n" + "=" * 65)
        print("🎉 SUCCESS! PlantCare AI has been deployed to Hugging Face Spaces!")
        print("=" * 65)
        print(f"\n🌐 Live Space URL:   https://huggingface.co/spaces/{repo_id}")
        print("⏳ Note: The Space will build and install dependencies in ~2-3 minutes.")
        print("   You can view the real-time build logs directly on your Space page.\n")
    except Exception as e:
        print(f"\n❌ Upload failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
