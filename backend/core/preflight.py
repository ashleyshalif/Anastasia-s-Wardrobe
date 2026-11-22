"""
core/preflight.py

Automated Preflight Environment & Database Validator for Ryna's Wardrobe.
Runs on backend startup to ensure zero guesswork on fresh laptop environments.
"""

import os
import sys
from pathlib import Path
from django.conf import settings
from django.db import connection

_PREFLIGHT_HAS_RUN = False


def run_preflight_check():
    """
    Validates required environment variables and database connectivity.
    Prints human-readable, actionable guidance instead of letting the developer
    hit an obscure stack trace.
    """
    global _PREFLIGHT_HAS_RUN
    if _PREFLIGHT_HAS_RUN:
        return
    _PREFLIGHT_HAS_RUN = True

    print("\n" + "=" * 70)
    print("  RYNA'S WARDROBE ATELIER — BACKEND PREFLIGHT SYSTEM CHECK")
    print("=" * 70)

    # 1. Check .env file presence
    backend_dir = Path(settings.BASE_DIR)
    env_file = backend_dir / ".env"
    if not env_file.exists():
        print("  ⚠️  [NOTICE] 'backend/.env' file was not detected.")
        print("     A fallback configuration was loaded automatically.")
        print("     To customize, duplicate 'backend/.env.example' to 'backend/.env'.")
    else:
        print("  ✅ [ENV] Configuration loaded from 'backend/.env'.")

    # 2. Check SECRET_KEY
    secret_key = getattr(settings, "SECRET_KEY", "")
    if not secret_key or "django-insecure" in secret_key:
        print("  ℹ️  [SECURITY] Using development DJANGO_SECRET_KEY.")
        print("     To generate a production key, run:")
        print("     python -c \"import secrets; print(secrets.token_urlsafe(50))\"")
    else:
        print("  ✅ [SECURITY] Custom DJANGO_SECRET_KEY is configured.")

    # 3. Check Database Connectivity
    try:
        connection.ensure_connection()
        tables = connection.introspection.table_names()
        if "store_product" in tables and "auth_user" in tables:
            print("  ✅ [DATABASE] SQLite connection healthy; schema migrations detected.")
        else:
            print("  ⚠️  [DATABASE NOTICE] Database tables are not initialized yet.")
            print("     Initialize and seed your database by executing:")
            print("       python manage.py migrate")
            print("       python manage.py seed_data")
    except Exception as db_err:
        print(f"  ❌ [DATABASE ERROR] Unable to connect to database: {db_err}")
        print("     Check permissions on 'backend/db.sqlite3' or run: python manage.py migrate")

    # 4. Check Optional Integrations (Graceful Fallback Status)
    print("\n  --- Plug-and-Play Integrations Status ---")

    # Razorpay
    rzp_key = getattr(settings, "RAZORPAY_KEY_ID", "")
    if rzp_key:
        print(f"  ✅ Razorpay: Configured (Key ID: {rzp_key[:8]}...)")
    else:
        print("  ℹ️  Razorpay: Unconfigured in .env -> Simulated sandbox checkout active.")

    # Google OAuth
    g_client = getattr(settings, "GOOGLE_CLIENT_ID", "")
    if g_client:
        print(f"  ✅ Google OAuth: Configured (Client ID: {g_client[:12]}...)")
    else:
        print("  ℹ️  Google OAuth: Unconfigured in .env -> Instant evaluation sign-in active.")

    # SMTP Mailer
    smtp_user = getattr(settings, "SMTP_USER", "")
    if smtp_user:
        print(f"  ✅ SMTP Mailer: Configured ({smtp_user})")
    else:
        print("  ℹ️  SMTP Mailer: Unconfigured in .env -> Emails previewed in terminal console.")

    print("=" * 70 + "\n")
