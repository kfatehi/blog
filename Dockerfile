FROM node
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
ENTRYPOINT [ "node_modules/.bin/hexo" ]