FROM node:16.15.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD index.ts ./
ADD package.json ./
RUN npm install -g typescript
RUN npm install
COPY . .
