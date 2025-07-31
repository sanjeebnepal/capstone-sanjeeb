FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Declare build arg to receive API URL
ARG REACT_APP_API_URL

# Set environment variable for build
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
