---
title: Docker wordpress SSL fix
date: 2024-01-21 09:47:26
tags:
- wordpress
- operations
- docker
---

Fixes an issue where wordpress does not realize you've already got SSL resulting in a redirect loop.

```php
// Needed this to get SSL working properly... https://blog.ldev.app/running-wordpress-behind-ssl-and-nginx-reverse-proxy/
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
        $_SERVER['HTTPS'] = 'on';
}
```