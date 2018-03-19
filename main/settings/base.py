# settings/base.py
"""
THIS PROJECT IS NOW USING DJANGO VERSION 1.11
THIS PROJECT IS NOW USING DJANGO VERSION 2.0
"""

import os
import json

# Normally we wouldn't import ANYTHING from Django directly
# into our settings, but ImproperlyConfigured is an exception.
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!

# This is pretty much copied from the two scoops of django 1.8 book
# JSON based secrets module
#with open("secrets.json") as f:
#    secrets = json.loads(f.read())
#
#def get_secret(setting, secrets=secrets):
#    """Get the secret variable or return the explicit exception."""
#    try:
#        return secrets[setting]
#    except KeyError:
#        error_msg = "Set the {0} environment variable".format(setting)
#        raise ImproperlyConfigured(error_msg)
#
#SECRET_KEY = get_secret("SECRET_KEY")
SECRET_KEY = os.environ.get("SECRET_KEY")

ALLOWED_HOSTS = []


# Application definition


INSTALLED_APPS = [
    # DJANGO
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # THIRD PARTY
    # "rest_framework",

    # LOCAL
    "core",
    "accounts",
    "datasets",
    "keywords",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "main.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "main.wsgi.application"

AUTH_USER_MODEL = "core.User"

# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Europe/Berlin"

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/
# I am going to change this to use a cdn maybe that should be in the production file
STATIC_URL = "/static/"

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]

# set the STATIC_ROOT to a directory I would like to serve the static files
# from. Maybe just outside of the BASE_DIR would be good for development, but I
# think that maybe a specific place for the deployed version would be good.
STATIC_ROOT = os.path.join(os.path.dirname(BASE_DIR), "static_root")


# Redirect to home URL after login (Default redirects to /accounts/profile/)
LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/'

# This won't work yet I think, it's kind of just here before the real thing
# gets set up
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Going to set up the email with a dummy gmail account
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'zmtdummy'
EMAIL_HOST_PASSWORD = 'zmtBremen1991'
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'zmtdummy@gmail.com'
