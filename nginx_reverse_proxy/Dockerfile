FROM nginx

RUN apt-get update && apt-get install -y \
    software-properties-common && add-apt-repository "deb http://deb.debian.org/debian stretch main" && \
    apt-get update && apt-get install -y \
    certbot python3-certbot-nginx
