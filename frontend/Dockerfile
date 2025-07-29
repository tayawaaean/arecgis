# Dockerfile for React client


FROM nginx:stable-alpine3.17 AS prod

WORKDIR /usr/share/nginx/html

COPY /build .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]