#!/usr/bin/env python3
"""
start.py — Universal Cross-Platform Launcher for Ryna's Wardrobe.
Works seamlessly on Windows, macOS, and Linux from any terminal.

Run with:
    python start.py
Or:
    npm run dev  /  pnpm run dev
"""

import os
import sys
import time
import socket
import signal
import shutil
import webbrowser
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "artifacts" / "rynas-wardrobe"
IS_WINDOWS = sys.platform.startswith("win")

processes = []


def free_port(port):
    """Frees a local port if currently bound by an old process."""
    try:
        if IS_WINDOWS:
            # Use PowerShell to stop processes holding the port cleanly
            cmd = f"Get-NetTCPConnection -LocalPort {port} -ErrorAction SilentlyContinue | ForEach-Object {{ Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }}"
            subprocess.run(["powershell", "-NoProfile", "-Command", cmd], capture_output=True)
        else:
            # Unix: lsof & kill
            cmd = f"lsof -ti:{port} | xargs kill -9 2>/dev/null"
            subprocess.run(cmd, shell=True, capture_output=True)
    except Exception:
        pass


def get_backend_python():
    """Locates the virtual environment Python executable."""
    venv_dir = BACKEND_DIR / "venv"
    if IS_WINDOWS:
        candidate = venv_dir / "Scripts" / "python.exe"
    else:
        candidate = venv_dir / "bin" / "python"

    if candidate.exists():
        return str(candidate)
    return sys.executable


def get_frontend_cmd():
    """Finds pnpm or npm executable."""
    pnpm = shutil.which("pnpm")
    if pnpm:
        return [pnpm, "run", "dev"]
    npm = shutil.which("npm")
    if npm:
        return [npm, "run", "dev"]
    return ["npx", "pnpm", "run", "dev"]


def cleanup(signum=None, frame=None):
    """Gracefully shuts down all spawned processes."""
    print("\n[*] Stopping all servers...")
    for proc in processes:
        try:
            if IS_WINDOWS:
                subprocess.run(["taskkill", "/F", "/T", "/PID", str(proc.pid)], capture_output=True)
            else:
                proc.terminate()
                proc.wait(timeout=2)
        except Exception:
            pass
    print("[*] All servers stopped cleanly. Goodbye!\n")
    sys.exit(0)


def main():
    print("=" * 70)
    print("      👗 RYNA'S WARDROBE — ATELIER SERVER LAUNCHER")
    print("=" * 70)
    print(f"[*] Project root: {ROOT_DIR}")

    # Set up signal handlers for graceful exit
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    # 1. Free ports 3000 and 8000
    print("[*] Checking and freeing ports 3000 & 8000...")
    free_port(3000)
    free_port(8000)
    time.sleep(1)

    # 2. Launch Django Backend
    python_exe = get_backend_python()
    print(f"[*] Starting Django Backend (Port 8000)...")
    print(f"    Admin Portal: http://127.0.0.1:8000/admin/")
    backend_proc = subprocess.Popen(
        [python_exe, "manage.py", "runserver", "127.0.0.1:8000"],
        cwd=BACKEND_DIR,
    )
    processes.append(backend_proc)

    time.sleep(2)

    # 3. Launch Next.js Frontend
    frontend_cmd = get_frontend_cmd()
    print(f"[*] Starting Next.js Frontend (Port 3000)...")
    print(f"    Storefront:   http://localhost:3000")
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=FRONTEND_DIR,
    )
    processes.append(frontend_proc)

    # 4. Open default web browser
    time.sleep(2)
    print("[*] Opening storefront in default browser: http://localhost:3000")
    try:
        webbrowser.open("http://localhost:3000")
    except Exception:
        pass

    print("\n" + "=" * 70)
    print("  [ONLINE] Servers are running. Press Ctrl+C at any time to stop.")
    print("=" * 70 + "\n")

    # Keep running and monitor
    try:
        while True:
            time.sleep(1)
            # Check if any process terminated unexpectedly
            for p in processes:
                if p.poll() is not None:
                    print(f"[!] Warning: Process {p.pid} exited with code {p.returncode}.")
                    cleanup()
    except KeyboardInterrupt:
        cleanup()


if __name__ == "__main__":
    main()
