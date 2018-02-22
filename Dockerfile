FROM python:3.6
MAINTAINER Patrick Curry (currypat1985@gmail.com)

ENV PYTHONUNBUFFERED 1
ENV SECRET_KEY=secret
ENV CRYPTO_KEY="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQ="

RUN mkdir /src

WORKDIR /src

ADD requirements.txt /src/

RUN pip install -r requirements.txt

ADD . /src/

EXPOSE 8000
CMD ["sh", "./container_start.sh"]