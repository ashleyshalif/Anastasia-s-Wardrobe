"""
store/apps.py
App configuration for the 'store' Django app.
"""
from django.apps import AppConfig


class StoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "store"
    verbose_name = "Ryna's Wardrobe — Store"
