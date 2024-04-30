# FROM registry01.loyalto.id/pus-fe-webadmin:builder AS builder
# #FROM node:16.15.0-alpine AS builder
# WORKDIR /usr/src/app
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .
FROM node:18.18.0-alpine AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ARG BRANCH
RUN npm run build-${BRANCH}

FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/dist/build /usr/share/nginx/html
# ARG PROJECT
# # FROM registry01.loyalto.id/${PROJECT}:builder as builder
# # FROM node:16.15.0-alpine as builder
# FROM node:16-alpine AS builder
# ##FROM node:13.12.0-alpine as builder
# #--build-arg
# ARG BRANCH
# # RUN npm install -g yarn
# # set working directory
# WORKDIR /app

# COPY  package.json ./
# RUN npm install
# # add app
# COPY . ./
# ENV PATH="./node_modules/.bin:$PATH"
# #set env file
# # COPY .env.${BRANCH} .env
# ##RUN yarn install
# # RUN ng build
# #RUN npm install
# #RUN npm run build:${BRANCH}
# EXPOSE 4200
# CMD ["npm", "run", "start"]

# #base image
# # FROM nginx:1.14.2-alpine
# # ARG BRANCH
# # ARG PORT
# # #set working directory
# # WORKDIR /usr/share/nginx/html/
# # #copy build source
# # COPY --from=builder /app/dist/build/ ./
# # #set env file
# # # COPY .env.${BRANCH} .env
# # COPY default.conf /etc/nginx/conf.d/default.conf

# # EXPOSE ${PORT}

# # CMD ["nginx", "-g", "daemon off;"]
