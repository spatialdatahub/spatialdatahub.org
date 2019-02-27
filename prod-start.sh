#!/bin/bash
python3 -m venv ENV
source ENV/bin/activate

# set secret environmental variables from file
# that is not under version control
export ENVIRONMENT=`jq -r '.ENVIRONMENT' secrets.json`
export DJANGO_SETTINGS_MODULE=main.settings.production
export IP=`jq -r '.IP' secrets.json`

# secret and crypto key
export SECRET_KEY=`jq -r '.SECRET_KEY' secrets.json`
export CRYPTO_KEY=`jq -r '.CRYPTO_KEY' secrets.json`

# database information
export DATABASE_NAME=`jq -r '.DATABASE_NAME' secrets.json`
export DATABASE_USER=`jq -r '.DATABASE_USER' secrets.json`
export DATABASE_PASSWORD=`jq -r '.DATABASE_PASSWORD' secrets.json`
export DATABASE_HOST=`jq -r '.DATABASE_HOST' secrets.json`
export DATABASE_PORT=`jq -r '.DATABASE_PORT' secrets.json`

# email information
export EMAIL_HOST=`jq -r '.EMAIL_HOST' secrets.json`
export EMAIL_PORT=`jq -r '.EMAIL_PORT' secrets.json`
export EMAIL_HOST_USER=`jq -r '.EMAIL_HOST_USER' secrets.json`
export EMAIL_HOST_PASSWORD=`jq -r '.EMAIL_HOST_PASSWORD' secrets.json`
export DEFAULT_FROM_EMAIL=`jq -r '.DEFAULT_FROM_EMAIL' secrets.json`

pip install --upgrade pip
pip install -r requirements.txt

python manage.py migrate
#gunicorn main.wsgi:application --bind 0.0.0.0:8000
