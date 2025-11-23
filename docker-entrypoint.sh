#!/bin/sh
set -e

# Get PORT from environment or use 8080
PORT="${PORT:-8080}"

echo "Configuring nginx to listen on port $PORT..."

# Create nginx config with the actual port number
cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen $PORT;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

echo "Starting nginx..."
exec nginx -g 'daemon off;'