FROM node:16-alpine

WORKDIR /app

COPY . /app

RUN npm install 
RUN npm run build

EXPOSE 8000 

CMD ["node", "./Build/index.js"]