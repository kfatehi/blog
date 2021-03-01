# Docker Quick Start

### Create a new post

``` bash
$ docker run --rm -v $PWD:/app -w /app -it node /app/node_modules/.bin/hexo new "My New Post"
```

### Run server

``` bash
$ docker run --rm -v $PWD:/app -w /app --network=br1 -it node /app/node_modules/.bin/hexo server
```
Start the server

## Quick Start

### Create a new post

``` bash
$ hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

``` bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

### Generate static files

``` bash
$ hexo generate
```

More info: [Generating](https://hexo.io/docs/generating.html)

### Deploy to remote sites

``` bash
$ hexo deploy
```

More info: [Deployment](https://hexo.io/docs/deployment.html)
