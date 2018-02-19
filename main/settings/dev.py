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

################################################
# set this thing up for travis and for gitlab-ci
# this shouldn't be in here
################################################
"""
if 'TRAVIS' in os.environ:
    DATABASES = {
        'default': {
            'ENGINE':   'django.db.backends.postgresql_psycopg2',
            'NAME':     'travis_ci_test',
            'USER':     'postgres',
            'PASSWORD': '',
            'HOST':     'localhost',
            'PORT':     '',
        }
    }
else:
    DATABASES = {

    }
"""

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
