---
title: How to configure nginx stream proxy to route traffic based on subdomain to different upstream backends
date: 2023-08-17 10:43:34
tags:
- nginx
---

Lab notes.

Scenario: We have two backend webservers powering our website via nginx. We have some risky new feature we want to rollout.

Can we know which subdomain is being used, and choose a specific backend just for that subdomain?

Yes, see http://nginx.org/en/docs/stream/ngx_stream_ssl_preread_module.html

An example use case can be seen here too: https://serverfault.com/questions/1078484/nginx-stream-block-with-wildcard-filtering-of-subdomains

But let's lab it out.

Let's get a basic python server to act as our origin service:

```python
from flask import Flask, request
from threading import Thread

def create_app(port):
    app = Flask(__name__)

    @app.route('/')
    def index():
        host = request.headers.get('Host', 'Unknown host')
        return f"<p>Host: {host}</p>\n<p>Port: {port}</p>\n", 200

    app.run(port=port, debug=False)

ports = range(8001, 8005)
threads = [Thread(target=create_app, args=(port,)) for port in ports]

for thread in threads:
    thread.start()

for thread in threads:
    thread.join()
```

This will listen on ports 8001 to 8004 and reply with subdomain and port number as it sees it.

It'll be useful to know if our rules worked.

After using acme.sh to get a cert quickly for our domain, we can customize the nginx conf to wrap our backend service with SSL, and then use our stream proxy with this subdomain selection mechanism that we are testing:

```
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
  worker_connections 768;
}

http {
  sendfile on;
  tcp_nopush on;
  types_hash_max_size 2048;
  include /etc/nginx/mime.types;
  default_type application/octet-stream;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
  ssl_prefer_server_ciphers on;

  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log;

  gzip on;

  include /etc/nginx/conf.d/*.conf;
  include /etc/nginx/sites-enabled/*;

  server {
    listen 8080 proxy_protocol;
    location / {
      return 301 https://$host$request_uri;
    }
  }

  server {
    ssl_certificate /root/.acme.sh/x.kebcom.com_ecc/fullchain.cer;
    ssl_certificate_key /root/.acme.sh/x.kebcom.com_ecc/x.kebcom.com.key;
    listen 8101 ssl proxy_protocol;
    location / {
      proxy_pass http://127.0.0.1:8001;
      proxy_set_header Host $host;
      proxy_set_header Proxy "";
    }
  }
  server {
    ssl_certificate /root/.acme.sh/x.kebcom.com_ecc/fullchain.cer;
    ssl_certificate_key /root/.acme.sh/x.kebcom.com_ecc/x.kebcom.com.key;
    listen 8102 ssl proxy_protocol;
    location / {
      proxy_pass http://127.0.0.1:8002;
      proxy_set_header Host $host;
      proxy_set_header Proxy "";
    }
  }
  server {
    ssl_certificate /root/.acme.sh/x.kebcom.com_ecc/fullchain.cer;
    ssl_certificate_key /root/.acme.sh/x.kebcom.com_ecc/x.kebcom.com.key;
    listen 8103 ssl proxy_protocol;
    location / {
      proxy_pass http://127.0.0.1:8003;
      proxy_set_header Host $host;
      proxy_set_header Proxy "";
    }
  }
  server {
    ssl_certificate /root/.acme.sh/x.kebcom.com_ecc/fullchain.cer;
    ssl_certificate_key /root/.acme.sh/x.kebcom.com_ecc/x.kebcom.com.key;
    listen 8104 ssl proxy_protocol;
    location / {
      proxy_pass http://127.0.0.1:8004;
      proxy_set_header Host $host;
      proxy_set_header Proxy "";
    }
  }
}

stream {
  map $ssl_preread_server_name $name {
    include /etc/nginx/backends.map;
  }

  upstream x {
    server 127.0.0.1:8101;
    server 127.0.0.1:8102;
  }

  upstream y {
    server 127.0.0.1:8103;
    server 127.0.0.1:8104;
  }

  server {
    listen 80;
    proxy_pass 127.0.0.1:8080;
    proxy_protocol on;
  }

  server {
    listen 443;
    proxy_protocol on;
    ssl_preread on;
    proxy_pass $name;
  }
}
```

Finally let's create the backends.map file (this could be named anything except that it cannot end in .conf, otherwise nginx will try to parse directives and thus error out since this is merely a way to externalize the map to its own file for easy editing without affecting the rest of the config.)

```
y.kebcom.com  y;
default       x;
```

And this works! Thanks to [RFC 6066 Section 3](https://datatracker.ietf.org/doc/html/rfc6066#section-3) this was easy to pull off.
