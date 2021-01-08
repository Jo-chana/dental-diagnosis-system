FROM python:3.8-slim-buster AS builder

WORKDIR /chikalab
COPY requirements.txt /chikalab

RUN pip install -r requirements.txt
RUN apt-get -y update
RUN apt-get install -y --fix-missing \
    build-essential \
    cmake \
    git \
    wget \
    curl \
    zip \
    libgl1-mesa-glx \
    libgraphicsmagick1-dev \
    libatlas-base-dev \
    libavcodec-dev \
    libavformat-dev \
    libgtk2.0-dev \
    libjpeg-dev \
    liblapack-dev \
    libswscale-dev \
    && apt-get clean && rm -rf /tmp/* /var/tmp/* \
    cd ~ && \
    mkdir -p dlib && \
    git clone -b 'v19.9' --single-branch https://github.com/davisking/dlib.git dlib/ && \
    cd dlib/ && \
    python3 setup.py install --yes USE_AVX_INSTRUCTIONS

COPY . ./
ENV PYTHONUNBUFFERED Trued

CMD exec gunicorn --bind :$PORT --workers 2 --threads 8 main:app
#ENTRYPOINT FLASK_APP=/chikalab/main.py flask run --host=0.0.0.0