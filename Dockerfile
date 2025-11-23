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

# Copy nginx config and startup script
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Make script executable
RUN chmod +x /docker-entrypoint.sh

# Start with our custom script
CMD ["/docker-entrypoint.sh"]