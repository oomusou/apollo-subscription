FROM node:lts-alpine
WORKDIR /usr/app
COPY package.json .
RUN yarn install --production
COPY dist/* ./
CMD [ "node", "index.js" ]
