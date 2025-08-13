# Multi-stage Dockerfile for React client

# 1) Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Allow passing envs at build time if needed
ARG REACT_APP_API_URL
ARG REACT_APP_IMAGE_BASE_URL
ARG REACT_APP_OWM_KEY
RUN npm run build

# 2) Nginx serve stage
FROM nginx:stable-alpine3.17 AS prod
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]