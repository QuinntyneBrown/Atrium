# syntax=docker/dockerfile:1

# ---- build ----
# Node 20 (Angular 17's supported LTS) avoids the host's Node 24 tooling caveats.
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- serve ----
FROM nginx:alpine AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf
# The @angular-devkit/build-angular:application builder emits to dist/frontend/browser.
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
