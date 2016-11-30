FROM node:7.2.0-onbuild

ENV NODE_ENV=production

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm install

EXPOSE 8000

CMD npm start
