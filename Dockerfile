# ====== Stage 1: Build Angular ======
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# ====== Stage 2: Serve with Nginx ======
FROM nginx:stable-alpine

# Copy built app
COPY --from=build /app/dist/web-ui/browser /usr/share/nginx/html

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Fix line endings and make executable
RUN apk add --no-cache dos2unix && \
    dos2unix /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Start with our script
ENTRYPOINT ["/docker-entrypoint.sh"]