# settings/production.py
"""
Django production settings. How do I deal with this file and settings?
"""

from .base import *


"""
The secret key and database info should come from the same file, and it
should probably be a JSON file (per two scoops of django's suggestion).
"""

#with open('/etc/secret_key.txt') as f:
#    SECRET_KEY = f.read().strip()

SECRET_KEY = os.environ.get("SECRET_KEY")

DEBUG = False

#ALLOWED_HOSTS = ['https://map.leibniz-zmt.de/']
ALLOWED_HOSTS = ['map.leibniz-zmt.de/', '127.0.0.1', 'localhost'] # for the time being

# I am not sure why these are important.
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

#DATABASES = {
#    "default": {
#        "ENGINE": "django.db.backends.postgresql_psycopg2",
#        "NAME": get_secret("DATABASES_NAME"),
#        "USER": get_secret("DATABASES_USER"),
#        "PASSWORD": get_secret("DATABASES_PASSWORD"),
#        "HOST": get_secret("DATABASES_HOST"),
#        "PORT": get_secret("DATABASES_PORT"),
#    }
#}

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
