# docker build . --tag personal-site:latest

FROM nginx:1.17
COPY . /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
