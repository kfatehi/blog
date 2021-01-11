---
title: Serve Interactable Linux Windows To Browsers
date: 2021-01-11 09:12:14
tags:
- linux
- kvm
---

On Linux these days it is very easy to serve any window through a browser.

You'll need to install websockify and novnc for this technique. This post continues from the steps described here:

https://www.server-world.info/en/note?os=Ubuntu_18.04&p=desktop&f=7 

Now we will launch the two relevant programs together. A quick program I remembered that can do this is a node package called `concurrently`. 

I use i3 as my window manager, and would like to create a program called `wincat` that I can launch with dmenu to automate the technique.

So here's `/usr/local/bin/wincat`

```
#!/bin/bash
i3-sensible-terminal -e _wincat
```

And here's `/usr/local/bin/_wincat`
```
#!/bin/bash
/home/dfh/.asdf/shims/npx concurrently "x11vnc -id pick -forever" "websockify --web=/usr/share/novnc/ --cert=/etc/ssl/novnc.pem 6080 localhost:5900"
```

Now I can run `wincat`, click the window I want to serve, and access the server at https://hostname:6080 -- when I'm done I just send interrupt signal to the terminal to kill the process tree.
