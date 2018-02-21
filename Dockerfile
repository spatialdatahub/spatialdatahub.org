FROM python:3.6

# Environmental variables
ENV PYTHONUNBUFFERED 1
ENV SECRET_KEY=secret
ENV CRYPTO_KEY="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ="

RUN mkdir /code

WORKDIR /code

ADD requirements.txt /code/

RUN pip install -r requirements.txt

ADD . /code/

EXPOSE 8000

#CMD ["python3", "manage.py", "runserver", "--setting=main.settings.dev"]
CMD ["sh", "./container_start.sh"]