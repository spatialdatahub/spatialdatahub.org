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

#ALLOWED_HOSTS = ["https://map.leibniz-zmt.de/"]
ALLOWED_HOSTS = ["https://www.spatialdatahub.org"] # This must change

# I am not sure why these are important.
# This is https stuff I think.
# how is this stuff testable?
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_EXPIRE_AT_BROWSER_CLOSE=True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

if "RDS_HOSTNAME" in os.environ:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ["RDS_DB_NAME"],
            "USER": os.environ["RDS_USERNAME"],
            "PASSWORD": os.environ["RDS_PASSWORD"],
            "HOST": os.environ["RDS_HOSTNAME"],
            "PORT": os.environ["RDS_PORT"],
        }
    }


STATIC_URL = "https://s3.eu-central-1.amazonaws.com/spatialdatahub-static/"
