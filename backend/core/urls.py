"""
core/urls.py
Main URL configuration for the Django project.
All API routes are prefixed with /api/.
"""

import os
from pathlib import Path
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.views.generic.base import RedirectView

FRONTEND_IMAGES_DIR = settings.BASE_DIR.parent / "artifacts" / "rynas-wardrobe" / "public" / "images"

ADMIN_PATH = os.getenv("DJANGO_ADMIN_URL", "admin").strip("/") + "/"

urlpatterns = [
    # Root redirect -> automatically send visitors to admin console
    path("", RedirectView.as_view(url=f"/{ADMIN_PATH}", permanent=False)),

    # Django admin panel — configurable via DJANGO_ADMIN_URL in .env (defaults to admin/)
    path(ADMIN_PATH, admin.site.urls),

    # All store API routes — http://127.0.0.1:8000/api/...
    path("api/", include("store.urls")),

    # Serve static frontend images during development so Django Admin previews don't 404
    re_path(r"^images/(?P<path>.*)$", serve, {"document_root": FRONTEND_IMAGES_DIR}),
]

# Serve uploaded media files (product images) in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

