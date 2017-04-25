# settings/production.py
"""
Django production settings. How do I deal with this file and settings?
"""

from .base import *


"""
The secret key and database info should come from the same file, and it
should probably be a JSON file (per two scoops of django's suggestion).
"""

with open('/etc/secret_key.txt') as f:
    SECRET_KEY = f.read().strip()

DEBUG = False

ALLOWED_HOSTS = ['https://map.leibniz-zmt.de/']

# I am not sure why these are important.
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
