# ====== Stage 1: Build Angular ======
FROM node:20 AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build for production
RUN npm run build -- --configuration production

# ====== Stage 2: Serve with Nginx ======
FROM nginx:stable-alpine

# Copy built Angular app
COPY --from=build /app/dist/web-ui/browser /usr/share/nginx/html

# Copy nginx config template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Expose port (Railway will set this dynamically)
EXPOSE 8080

# Nginx will automatically substitute environment variables in templates
CMD ["nginx", "-g", "daemon off;"]