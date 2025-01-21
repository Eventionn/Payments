FROM node:23-alpine

RUN apk add --no-cache \
    openssl \
    libc6-compat
    
# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . . 

RUN npx prisma generate

EXPOSE 5004

CMD [ "npm", "run", "dev" ]