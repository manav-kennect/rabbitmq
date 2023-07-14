FROM node:lts-alpine
ENV MY_NETWORK='ampq-network'
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 10001
RUN chown -R node /usr/src/app
USER node
CMD ["node", "publisher.js"]
