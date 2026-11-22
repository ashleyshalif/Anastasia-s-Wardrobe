"""
Django settings for Ryna's Wardrobe backend.
Reads sensitive values from the .env file using python-dotenv.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# ─── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from backend/.env
load_dotenv(BASE_DIR / ".env")

# ─── Core Security ────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "django-insecure-change-this-now")
DEBUG = os.getenv("DEBUG", "True") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1,testserver").split(",")

# ─── Installed Apps ───────────────────────────────────────────────────────────
INSTALLED_APPS = [
    # Django built-ins
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",           # Django REST Framework - lets us build APIs easily
    "rest_framework.authtoken", # Token authentication for customer sessions
    "corsheaders",              # CORS - allows the Next.js frontend to talk to Django
    # Our apps
    "store",                # Products, categories, orders, wishlist, contact
    "accounts",             # User accounts (not used yet, ready for later)
    "orders",               # Order models (we use store.Order but keep this for future)
]

# ─── Middleware ────────────────────────────────────────────────────────────────
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.gzip.GZipMiddleware",    # Must be first - handles CORS preflight
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "store" / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

# ─── Database ─────────────────────────────────────────────────────────────────
# Using SQLite for development - simple file-based database, no extra setup needed
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
        "CONN_MAX_AGE": int(os.getenv("CONN_MAX_AGE", "600")),
        "OPTIONS": {
            "timeout": 30,
        },
    }
}

# ─── Cache Configuration ──────────────────────────────────────────────────────
# Fast in-memory cache for product and category API responses
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "rynas-wardrobe-cache",
        "TIMEOUT": 1800,  # 30 minutes default TTL
    }
}


# ─── Password Validation ──────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ─── Internationalisation ─────────────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"   # IST - matching your location
USE_I18N = True
USE_TZ = True

# ─── Static & Media Files ─────────────────────────────────────────────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"   # Product images will be uploaded here

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ─── Django REST Framework ────────────────────────────────────────────────────
REST_FRAMEWORK = {
    # Return JSON by default (not HTML browsable API in production)
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",  # Useful in dev - shows a nice UI
    ],
    # Authentication classes (supports Bearer tokens and Session cookies)
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "store.authentication.BearerOrTokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    # Our API is public for browsing by default, orders and account require authentication
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    # Throttling to protect against credential stuffing, spam, and bot attacks
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "120/min",
        "user": "600/min",
        "login": "5/min",
        "register": "3/hour",
        "contact": "5/hour",
        "order_create": "10/min",
    },
    # Pagination - return 20 products per page by default
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

# ─── Security Hardening ───────────────────────────────────────────────────────
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True

if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = os.getenv("SECURE_SSL_REDIRECT", "False") == "True"

# ─── CORS ─────────────────────────────────────────────────────────────────────
# Allow the Next.js frontend (localhost:3000) to make requests to this Django server
CORS_ALLOWED_ORIGINS = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
APPEND_SLASH = False

# ─── Razorpay Payment Gateway (Test / Sandbox) ───────────────────────────────
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_519RynaAtelier").strip()
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "secret_test_RynaAtelierSecret2026").strip()
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "").strip()

# ─── Google OAuth 2.0 Configuration ──────────────────────────────────────────
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "").strip()
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "").strip()
GOOGLE_CALLBACK_URL = os.getenv("GOOGLE_CALLBACK_URL", "http://localhost:3000/account").strip()

# ─── Email (SMTP Protocol) Configuration ─────────────────────────────────────
# Supports both standard EMAIL_* and plug-and-play SMTP_* variables from .env
EMAIL_BACKEND = os.getenv("DJANGO_EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST = os.getenv("SMTP_HOST") or os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("SMTP_PORT") or os.getenv("EMAIL_PORT", "587"))

_smtp_secure = (os.getenv("SMTP_SECURE", "")).lower()
if _smtp_secure in ("true", "ssl", "465"):
    EMAIL_USE_SSL = True
    EMAIL_USE_TLS = False
else:
    EMAIL_USE_SSL = False
    EMAIL_USE_TLS = (os.getenv("EMAIL_USE_TLS", "True").lower() in ("true", "1", "yes")) or (_smtp_secure in ("tls", "587"))

EMAIL_HOST_USER = (os.getenv("SMTP_USER") or os.getenv("EMAIL_HOST_USER", "asfiyaf343@gmail.com")).strip('\"\'')
EMAIL_HOST_PASSWORD = (os.getenv("SMTP_PASS") or os.getenv("EMAIL_HOST_PASSWORD", "")).strip('\"\'')

_from_name = os.getenv("SMTP_FROM_NAME", "Ryna's Wardrobe")
_from_email = os.getenv("SMTP_FROM_EMAIL") or os.getenv("DEFAULT_FROM_EMAIL") or (EMAIL_HOST_USER if EMAIL_HOST_USER else "care@rynaswardrobe.com")
if _from_name and "<" not in _from_email:
    DEFAULT_FROM_EMAIL = f"{_from_name} <{_from_email}>"
else:
    DEFAULT_FROM_EMAIL = _from_email
SERVER_EMAIL = DEFAULT_FROM_EMAIL
EMAIL_TIMEOUT = 10

# LocMemCache provides fast, thread-safe in-memory caching immune to Windows/OneDrive file locking
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "rynas-wardrobe-cache",
        "TIMEOUT": 1800,
    }
}

