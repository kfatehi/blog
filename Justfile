build:
    docker-compose build

start: build
    docker-compose up

new +NAME: build
    docker-compose run --rm hexo new "{{NAME}}"

dev:
  docker-compose run -p 4000:4000 --rm hexo server
