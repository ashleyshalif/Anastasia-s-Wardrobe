#!/usr/bin/env python3
"""
setup.py — Universal Cross-Platform Setup & Dependency Installer
for Ryna's Wardrobe (Windows, macOS, Linux).

Run with:
    python setup.py
"""

import os
import sys
import shutil
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "artifacts" / "rynas-wardrobe"


def print_step(title):
    print("\n" + "=" * 70)
    print(f"  👉 {title}")
    print("=" * 70)


def run_cmd(cmd, cwd=None, error_msg="Command failed"):
    """Runs a shell command cross-platform and prints output."""
    cmd_str = " ".join(cmd) if isinstance(cmd, list) else cmd
    print(f"[*] Running: {cmd_str}")
    res = subprocess.run(cmd, cwd=cwd or ROOT_DIR, shell=isinstance(cmd, str))
    if res.returncode != 0:
        print(f"\n❌ Error: {error_msg} (Exit code: {res.returncode})")
        sys.exit(res.returncode)


def check_prerequisites():
    print_step("Step 1: Checking System Prerequisites")

    # 1. Python version >= 3.10
    py_ver = sys.version_info
    print(f"[*] Python version: {py_ver.major}.{py_ver.minor}.{py_ver.micro}")
    if py_ver < (3, 10):
        print("❌ Error: Python 3.10 or higher is required.")
        sys.exit(1)

    # 2. Node.js
    node_path = shutil.which("node")
    if not node_path:
        print("❌ Error: Node.js is not found in PATH. Please install Node.js >= 18.0.0.")
        sys.exit(1)
    node_ver = subprocess.check_output([node_path, "-v"], text=True).strip()
    print(f"[*] Node.js version: {node_ver}")

    # 3. Package manager (pnpm or npm)
    pnpm_path = shutil.which("pnpm")
    if pnpm_path:
        pnpm_ver = subprocess.check_output([pnpm_path, "-v"], text=True).strip()
        print(f"[*] pnpm version: {pnpm_ver} (Primary package manager)")
    else:
        npm_path = shutil.which("npm")
        if npm_path:
            npm_ver = subprocess.check_output([npm_path, "-v"], text=True).strip()
            print(f"[*] npm version: {npm_ver} (Will use npx pnpm / npm)")
        else:
            print("❌ Error: Neither pnpm nor npm was found in PATH.")
            sys.exit(1)


def setup_env_files():
    print_step("Step 2: Preparing Environment Files")

    env_configs = [
        (ROOT_DIR / ".env.example", ROOT_DIR / ".env"),
        (BACKEND_DIR / ".env.example", BACKEND_DIR / ".env"),
        (FRONTEND_DIR / ".env.example", FRONTEND_DIR / ".env.local"),
    ]

    for src, dst in env_configs:
        if dst.exists():
            print(f"  [EXISTS] {dst.relative_to(ROOT_DIR)} is already present (retaining existing config).")
        else:
            if src.exists():
                shutil.copy(src, dst)
                print(f"  [COPIED] {src.relative_to(ROOT_DIR)} -> {dst.relative_to(ROOT_DIR)}")
            else:
                print(f"  [WARN] Source template {src} not found.")


def setup_backend():
    print_step("Step 3: Setting Up Python Virtual Environment & Dependencies")

    venv_dir = BACKEND_DIR / "venv"
    is_win = sys.platform.startswith("win")

    # Create venv if missing
    if not venv_dir.exists():
        print("[*] Creating Python virtual environment in backend/venv...")
        run_cmd([sys.executable, "-m", "venv", str(venv_dir)], cwd=BACKEND_DIR, error_msg="Failed to create venv")

    # Locate python and pip executables
    if is_win:
        venv_python = venv_dir / "Scripts" / "python.exe"
        venv_pip = venv_dir / "Scripts" / "pip.exe"
    else:
        venv_python = venv_dir / "bin" / "python"
        venv_pip = venv_dir / "bin" / "pip"

    if not venv_python.exists():
        print(f"❌ Error: Virtual environment python not found at {venv_python}")
        sys.exit(1)

    print("[*] Upgrading pip...")
    run_cmd([str(venv_python), "-m", "pip", "install", "--upgrade", "pip"], cwd=BACKEND_DIR)

    print("[*] Installing backend dependencies from requirements.txt...")
    req_file = BACKEND_DIR / "requirements.txt"
    run_cmd([str(venv_pip), "install", "-r", str(req_file)], cwd=BACKEND_DIR, error_msg="Failed to install python packages")

    # Database migrations
    print_step("Step 4: Initializing Database & Seeding Catalog Data")
    print("[*] Running Django migrations...")
    run_cmd([str(venv_python), "manage.py", "migrate"], cwd=BACKEND_DIR, error_msg="Django migration failed")

    print("[*] Seeding Ryna's Wardrobe catalog and default staff accounts...")
    run_cmd([str(venv_python), "manage.py", "seed_data"], cwd=BACKEND_DIR, error_msg="Data seeding failed")


def setup_frontend():
    print_step("Step 5: Installing Frontend Dependencies")

    # Check for pnpm or npx pnpm
    pnpm_cmd = shutil.which("pnpm")
    if pnpm_cmd:
        install_cmd = [pnpm_cmd, "install"]
    else:
        install_cmd = ["npx", "pnpm", "install"]

    print(f"[*] Installing dependencies in {FRONTEND_DIR.relative_to(ROOT_DIR)}...")
    run_cmd(install_cmd, cwd=FRONTEND_DIR, error_msg="Frontend package installation failed")


def main():
    print("\n" + "=" * 70)
    print("      👗 RYNA'S WARDROBE — UNIVERSAL MACHINE SETUP")
    print("=" * 70)
    print(f"[*] Detected Platform: {sys.platform}")
    print(f"[*] Project Root:      {ROOT_DIR}")

    check_prerequisites()
    setup_env_files()
    setup_backend()
    setup_frontend()

    print("\n" + "=" * 70)
    print("  🎉 [SUCCESS] PROJECT SETUP COMPLETE & 100% READY!")
    print("=" * 70)
    print("\nTo start both servers, choose any of the following:")
    print("  * Windows 1-Click:   Double-click START_PROJECT.bat")
    print("  * Terminal Command:  python start.py")
    print("  * npm / pnpm:        npm run dev  (or pnpm run dev)")
    print("\nDefault Access URLs:")
    print("  * Storefront:  http://localhost:3000")
    print("  * Admin:       http://127.0.0.1:8000/admin/  (Login: USER / Maya@123)")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()
