#  Dockerfile for Node Express Backend

FROM node:20-alpine3.17

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

ENV NODE_ENV=production
RUN npm ci --omit=dev

# Copy app source code
COPY . .

# Exports
EXPOSE 3001

# Run as non-root
USER node

CMD ["node","server.js"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -qO- http://localhost:3001/livez | grep -q "" || exit 1