FROM node:20.3-slim AS build
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm config set legacy-peer-deps true && \
    npm install

COPY public/ public
COPY src/ src
RUN npm run build

FROM nginx:alpine3.17
COPY --from=build /app/build /usr/share/nginx/html

COPY scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
# RUN apk update --allow-untrusted && \
#     apk add --no-cache --allow-untrusted curl && \
#     rm -rf /var/cache/apk/*

# RUN addgroup -g 10101 -S appgroup
# RUN adduser -S -D -H -u 10101 -h /var/cache/nginx -s /sbin/nologin -G nginx appuser
# USER 10101

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
