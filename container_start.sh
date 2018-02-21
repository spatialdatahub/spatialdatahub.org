python manage.py makemigrations --settings=main.settings.dev
python manage.py migrate --settings=main.settings.dev
python manage.py test test.unit_tests --settings=main.settings.dev

