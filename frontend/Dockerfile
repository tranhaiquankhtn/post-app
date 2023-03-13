# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:lts as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm install --force

COPY ./ /app/

ARG FRONTEND_ENV=production

ENV NODE_ENV=${FRONTEND_ENV}

RUN npm run build -- --mode ${NODE_ENV}


# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15

COPY --from=build-stage /app/dist/ /usr/share/nginx/html

COPY ./deploys/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./deploys/nginx-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf
