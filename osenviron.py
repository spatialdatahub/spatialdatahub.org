import os

if 'This is not int the os.environ' in os.environ:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql_psycopg2",
            "NAME": "travis_ci_test",
            "USER": "postgres",
            "PASSWORD": "",
            "HOST": "localhost",
            "PORT": "5432",
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE':   'django.db.backends.postgresql_psycopg2',
            'NAME':     'STEVEN',
            'USER':     'BROST GREST',
            'PASSWORD': '',
            'HOST':     'Brocal host',
            'PORT':     '',
        }
    }


print(DATABASES)
