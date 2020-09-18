---
title: Hosting a GlobalChat Draw Server
date: 2020-09-17 22:43:26
tags:
- communication
- decentralization
---

[GlobalChat Draw](https://apps.apple.com/us/app/globalchat-draw/id1525630738?mt=12) is a new open-source end-to-end encrypted chat system with drawing capabilities built using Apple's latest graphics APIs. A mobile client is also in development. Before you complain about the price of the Mac app, remind yourself that Apple charges developers $100/year just to have the privilege of publication. Furthermore be aware that the clients (both the mobile and Mac apps) and server are all provided open-source from [the author's github page](https://github.com/mixflame?tab=repositories).

The technology used to create this is very interesting, especially if you're learning, but today we'll focus on hosting a server. Perhaps in another post we can delve into the source code for each component and understand how it works.

## Server Deployment

Now let's deploy a GlobalChat server. We'll use the [instructions from the official gdraw.chat website](https://gdraw.chat/en/home/host-server/):

Anyone can host a GlobalChat server. The current recommended way is to use Ubuntu snaps with Linux.

`snap install --beta crystal-gchat-server`

`crystal-gchat-server.change-passwords -i`

`crystal-gchat-server`

Here is a systemd unit we can use to automatically launch it.

```
[Unit]
Description=GlobalChat Draw Server
After=network.target
StartLimitIntervalSec=0
[Service]
Type=simple
Restart=always
RestartSec=1
User=root
ExecStart=/snap/bin/crystal-gchat-server

[Install]
WantedBy=multi-user.target
```

Install that in `/etc/systemd/system/gchat.service`

Enable it so that it runs automatically on startup

`systemctl enable gchat`

Start it now

`systemctl start gchat`

And make sure it's running

`systemctl status gchat`

To access the logs

`journalctl -fxu gchat`

Now there is a new server publicly visible within the application! This works because there is a master server list (also open source) to which the server software registers itself to. Thanks to Apple's strict policies, there are moderation tools built-in as well -- notice that you can set your admin password during server setup.