FROM node:lts
WORKDIR /usr/src/app
RUN npm install nodemon

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 7896

CMD ["npm", "run", "dev"]