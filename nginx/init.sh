#!/bin/sh
set -e

if [ "$APP_STATE" = "production" ]; then
    cp /etc/nginx/prod.conf /etc/nginx/conf.d/default.conf
else
    cp /etc/nginx/dev.conf /etc/nginx/conf.d/default.conf
fi

# Test configuration
nginx -t

# Start nginx
exec nginx -g 'daemon off;'
