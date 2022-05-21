build:
    docker-compose build

start: build
    docker-compose up

new +NAME: build
    docker-compose run --rm hexo new "{{NAME}}"