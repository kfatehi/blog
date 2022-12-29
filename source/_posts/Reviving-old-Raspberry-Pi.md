---
title: 2011 (armv6l) Raspberry Pis can still use the default OS of the Raspberry Pi Imager while NodeJS v11 is the last armv6l precompiled binary
date: 2022-06-23 19:36:38
tags:
- raspberry pi
- nodejs
- arm
---

An old 2011 Raspberry Pi I thought was damaged turned out to be just fine. The 5v adapter went bad somehow. Funny thing is I had two Pis deployed on this circuit, and both of their adapters went bad, whereas the Pis themselves are now verified working fine. The greater mystery about the adapters and power provision remain, but I learned a few facts about the Pi as I ended up reflashing the SD cards during verification:

1. The default OS provided by the official Raspberry Pi Imager software still works on units this old. I still went for the "legacy" Buster lite (no desktop) image, but I first tested the Bullseye desktop version and it worked fine, albeit very slow on the 2011 model. Even the configuration settings in the Imager program, where you can set hostname, wifi, public key, etc, worked perfectly.

2. NodeJS does not build official armv6 binaries after version 11. If you need NodeJS on a Pi this old, use this technique:

```
curl https://nodejs.org/dist/latest-v11.x/node-v11.15.0-linux-armv6l.tar.gz | sudo tar xzvf - --strip-components=1 -C /usr/local
```

I ended up verifying several old raspberry pis I have salvaged from various use cases around the house, and even an old Pi Zero (very first version) verified true with statement #1 above. It, too, is an armv6l and so statement #2 is also true.

Finally, do not forget to use overlay-fs feature before leaving your Pi to operate for years on end! This will help prevent your SD card from wearing out. Here's a discussion about that feature: https://forums.raspberrypi.com/viewtopic.php?t=294427
