# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:lts as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm install --force

COPY ./ /app/

ARG FRONTEND_ENV=production

ENV VITE_APP_ENV=${FRONTEND_ENV}

RUN npm run build


# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15

# RUN apt update -y &&  apt-get install -y ca-certificates

COPY --from=build-stage /app/dist/ /usr/share/nginx/html

COPY ./deploys/nginx.conf /etc/nginx/conf.d/default.conf

