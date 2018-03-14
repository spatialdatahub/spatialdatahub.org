FROM python:3.6
MAINTAINER Patrick Curry (currypat1985@gmail.com)

ENV PYTHONUNBUFFERED 1
ENV SECRET_KEY="secret"
ENV CRYPTO_KEY="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ="

# These are just to run with docker-compose... How do I set these for AWS?
ENV DATABASE_NAME="postgres"
ENV DATABASE_USER="postgres"
ENV DATABASE_PASSWORD=""
ENV DATABASE_HOST="db"
ENV DATABASE_PORT="5432"


RUN mkdir /src

WORKDIR /src

ADD requirements.txt /src/

RUN pip install -r requirements.txt

ADD . /src/
RUN pwd
#RUN ["chmod", "+x", "wait-for-it.sh"]
RUN chmod +x wait-for-it.sh

#EXPOSE 8000
#CMD ["sh", "./container_start.sh"]