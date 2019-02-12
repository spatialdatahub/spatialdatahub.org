#!/bin/bash
python3 -m venv ENV
source ENV/bin/activate

# set secret environmental variables
export SECRET_KEY=`jq -r '.SECRET_KEY' dev-secrets.json`
export CRYPTO_KEY=`jq -r '.CRYPTO_KEY' dev-secrets.json`

export EMAIL_HOST=`jq -r '.EMAIL_HOST' other-secrets.json`
export EMAIL_PORT=`jq -r '.EMAIL_PORT' other-secrets.json`
export EMAIL_HOST_USER=`jq -r '.EMAIL_HOST_USER' other-secrets.json`
export EMAIL_HOST_PASSWORD=`jq -r '.EMAIL_HOST_PASSWORD' other-secrets.json`
export DEFAULT_FROM_EMAIL=`jq -r '.DEFAULT_FROM_EMAIL' other-secrets.json`

pip install --upgrade pip
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver --settings=main.settings.dev
