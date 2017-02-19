FROM node:boron

RUN mkdir /app
WORKDIR /app

RUN npm install -g nodemon

COPY package.json /app
RUN npm install

COPY . /app

RUN npm run build-min

CMD ["npm", "start"]
