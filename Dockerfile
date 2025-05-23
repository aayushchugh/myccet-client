FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . /app

RUN npm run build

EXPOSE 3006

CMD ["npm", "start"]