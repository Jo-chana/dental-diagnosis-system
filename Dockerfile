FROM node:12.2.0-alphine

WORKDIR /chika-lab/app/static
COPY package.json /chika-lab/app/static/
RUN npm install
CMD ["npm", "run", "build"]


FROM python:3.8-slim-buster

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

WORKDIR /chika-lab
COPY requirements.txt /chika-lab
RUN pip install -r requirements.txt
COPY . ./
ENV PYTHONUNBUFFERED Trued
#CMD exec gunicorn --bind :$PORT --workers 2 --threads 8 main:app
ENTRYPOINT FLASK_APP=/chika-lab/app/main.py flask run --host=0.0.0.0


