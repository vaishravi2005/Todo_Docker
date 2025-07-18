
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npx", "serve", "-s", "build"]
ARG REACT_APP_BACKEND
ENV REACT_APP_BACKEND=$REACT_APP_BACKEND
