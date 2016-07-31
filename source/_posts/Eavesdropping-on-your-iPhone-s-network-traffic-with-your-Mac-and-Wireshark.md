---
title: Eavesdropping on your iPhone's network traffic with your Mac and Wireshark
date: 2016-07-27 10:50:46
tags:
- wireshark
---

**A few days after this writing, a relevant item appeared on HackerNews discussing the use of an HTTP proxy for this purpose, which allows you to see TLS traffic in most circumstances, a shortcoming of my approach here with wireshark. [Here is the link](https://news.ycombinator.com/item?id=12195470). The [top comment](https://news.ycombinator.com/item?id=12196063) recommends [mitmproxy](https://github.com/mitmproxy/mitmproxy) which looks like the better tool for the job in this case than wireshark! Still it is very good to learn so that you can intercept the traffic when lower level network functions are used directly, although this is becoming quite rare I think.**

"Pokemon Go" is a mobile phone game in which little mofos spawn in various places in the real world (on a map) and you have to be within proximity to (a) discover them and (b) "catch" them by throwing a ball at them.

Finding these little mofos is a hassle because you don't know where the optimal populations might be at any moment and/or you may be looking for a specific type of little mofo. If only you could see all the locations at once!

Someone created https://pokevision.com/ about a week prior to the writing of this article, however it is currently not working. It looks like this, showing you the exact locations and spawn timeouts of the little mofos anywhere:

{% asset_img pokevision.jpg %}

I believe that pokevision was created by reverse engineering the communication between the mobile app and the backend game server, determining the API, and then using that artificially from the pokevision servers, caching the responses appropriately in a little-mofo-location-database.

If we are to do the same reverse engineering task, and this applies to any traffic on your mobile device (or any device with wifi, but restricted access, a mobile phone being just that), we need to setup a wifi hotspot that we control and monitor.

On macOS, this is very easy. A simple checkbox abstracts away the creation and configuration of a bridge in which your wifi becomes an infrastructure access point and NAT and DHCP are handled for you automatically:

{% asset_img sharing.png %}

Next up we open wireshark and select the bridge as our capture interface. This allows us to eavesdrop on the iPhone, assuming it is connected to our Mac via wifi.

{% asset_img capture_interfaces.png %}

Now the packets start flowing in:

{% asset_img cap1.png %}

Notice the protocol is TLSv2. It's probably HTTP beneath that encryption layer. Wireshark lets us follow the connection, so the data stream is more readable than just straight packets:

{% asset_img context_follow.png %}

In this view we can see that we have correctly identified traffic originating from the "Pokemon Go" app, but that a handshake is underway and in order to view anything else, we'd need to decrypt the encryption layer.

{% asset_img following.png %}

This all took some 20 minutes or so and got us an environment in which at least the ciphertext traffic was available to us, and with the right keys, plaintext-observable. I think that the pokevision team took this to the next level, using an android phone (probably rooted) to harvest the keys required to decrypt the traffic.

Because pokevision was created through reverse engineering, it probably won't last. This explains why we are seeing this error despite the fact that the "Pokemon Go" app itself is currently operational. If I was niantic (owner of Pokemon Go), I would crack down on pokevision and add an in-app purchase in which the powers of pokevision were temporarily granted to a player.

{% asset_img pokevision_down.png %}
