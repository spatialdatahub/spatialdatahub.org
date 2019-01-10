# settings/dev.py
"""
Django development settings.

This should inheret everything from base.py, and have only
a couple key differences from it and production.py.
"""

from .base import *
DEBUG = True

# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

# It would be nice to use sqlite3 but it's not doing nice things with python
# and django right now
"""
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
"""

if 'TRAVIS' in os.environ:
    DATABASES = {
        'default': {
            'ENGINE':   'django.db.backends.postgresql_psycopg2',
            'NAME':     'travisci',
            'USER':     'postgres',
            'PASSWORD': '',
            'HOST':     'localhost',
            'PORT':     '',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'spatialdatahub_db',
            'USER': 'spatialdatahub_user',
            'PASSWORD': 'spatialdatahub_password',
            'HOST': '',
            'PORT': '5432'
            }
        }
