# docker build . --tag personal-site:latest

FROM nginx
COPY . /usr/share/nginx/html
