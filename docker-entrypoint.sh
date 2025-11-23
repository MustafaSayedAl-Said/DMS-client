#!/bin/sh

# Use Railway's PORT or default to 8080
PORT=${PORT:-8080}

echo "Starting nginx on port $PORT"

# Update nginx config with the correct PORT
sed -i "s/listen 8080/listen $PORT/g" /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'