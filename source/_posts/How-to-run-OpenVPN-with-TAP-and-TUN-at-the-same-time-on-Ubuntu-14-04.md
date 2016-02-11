---
title: How to run OpenVPN with TAP and TUN at the same time on Ubuntu 14.04
date: 2016-02-11 09:47:26
tags:
- openvpn
- ubuntu
---

My last post showed how to setup OpenVPN in TAP mode. Unfortunately, TAP is not supported on iOS (I'm using the official OpenVPN app from the App Store).

This post is a continuation of that post. So we already have a bridge configured (br0) running openvpn in TAP mode. Now we want to add a second listener in TUN mode for iOS. We will reuse the same key (hence we use duplicate-cn option in both server configs)

The OpenVPN side is easy. OpenVPN will scan for `.conf` files in `/etc/openvpn` so just:

Rename `/etc/openvpn/server.conf` to `/etc/openvpn/server-tap.conf`

Create `/etc/openvpn/server-tun.conf` with contents like so:

```
port 1190
proto udp
dev tun
ca ca.crt
cert server.crt
key server.key
dh dh2048.pem
server 10.8.0.0 255.255.255.0
ifconfig-pool-persist ipp.txt
push "redirect-gateway def1 bypass-dhcp"
push "dhcp-option DNS 8.8.8.8"
push "dhcp-option DNS 208.67.222.222"
duplicate-cn
keepalive 10 120
comp-lzo
user nobody
group nogroup
persist-key
persist-tun
status openvpn-status.log
verb 3
mute 20
```

Now you just need to configure the linux side.

We want to configure sysctl to make the kernel forward traffic out to the internet.

```sh
echo 1 > /proc/sys/net/ipv4/ip_forward
```

Persist this setting by editing `/etc/sysctl.conf` to uncomment this line:

```sh
net.ipv4.ip_forward=1
```

Next up you need to configure the firewall to perform NAT. Typically:

```sh
ufw allow ssh
ufw allow 1189/udp # expose the TAP listener
ufw allow 1190/udp # expose the TUN listener
```

The ufw forwarding policy needs to be set as well. We'll do this in ufw's primary configuration file.

```sh
vim /etc/default/ufw
```

Look for `DEFAULT_FORWARD_POLICY="DROP"`. This must be changed from DROP to ACCEPT. It should look like this when done:

```
DEFAULT_FORWARD_POLICY="ACCEPT"
```

Next we will add additional ufw rules for network address translation and IP masquerading of connected clients.

```sh
vim /etc/ufw/before.rules
```

Add the following to the top of your before.rules file:

```sh
*nat
:POSTROUTING ACCEPT [0:0] 
-A POSTROUTING -s 10.8.0.0/8 -o br0 -j MASQUERADE
COMMIT
```

We are allowing traffic from the openvpn clients to br0, our bridge interface configured previously.

Finally, enable the firewall

```sh
ufw enable
```

Your client provide will be pretty much identical to the TAP version. Here's what it should look like:

```
client
dev tun
proto udp
remote my-server-1 1190
resolv-retry infinite
nobind
persist-key
persist-tun
ca ca.crt
cert client.crt
key client.key
ns-cert-type server
comp-lzo
verb 3
mute 20
```

Install this on your device. You're now able to connect using TUN and TAP using a single openvpn server, using the same keys/identities.

### Reference
* https://www.digitalocean.com/community/tutorials/how-to-set-up-an-openvpn-server-on-ubuntu-14-04
* https://forums.openvpn.net/topic7748.html
