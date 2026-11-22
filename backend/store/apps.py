"""
store/apps.py
App configuration for the 'store' Django app.
"""
from django.apps import AppConfig


class StoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "store"
    verbose_name = "Ryna's Wardrobe — Store"

    def ready(self):
        import os
        import sys
        # Only run preflight check when running the server or explicit check commands
        if "runserver" in sys.argv or os.environ.get("RUN_MAIN") == "true":
            from core.preflight import run_preflight_check
            run_preflight_check()
