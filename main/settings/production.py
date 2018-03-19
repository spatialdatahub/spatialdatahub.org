# settings/production.py
"""
Django production settings. How do I deal with this file and settings?
"""

from .base import *


"""
The secret key and database info should come from the same file, and it
should probably be a JSON file (per two scoops of django's suggestion).
"""

SECRET_KEY = os.environ.get("SECRET_KEY")

DEBUG = False

#ALLOWED_HOSTS = ['https://map.leibniz-zmt.de/']
#ALLOWED_HOSTS = ['map.leibniz-zmt.de/', '127.0.0.1', 'localhost'] # for the time being
ALLOWED_HOSTS = ['*'] # This must change

# I am not sure why these are important.
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": os.environ.get("DATABASE_NAME"),
        "USER": os.environ.get("DATABASE_USER"),
        "PASSWORD": os.environ.get("DATABASE_PASSWORD"),
        "HOST": os.environ.get("DATABASE_HOST"),
        "PORT": os.environ.get("DATABASE_PORT"),
    }
}
