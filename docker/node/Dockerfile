FROM node:6-wheezy

MAINTAINER Chuck "MANCHUCK" Reeves <chuck@manchuck.com>

RUN apt-get update && apt-get install -y --no-install-recommends \
    && npm install -gq gulp eslint eslint-plugin-react babel-eslint

WORKDIR /var/www