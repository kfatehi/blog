---
title: Restrict process traffic to VPN interface
date: 2016-07-18 21:57:52
tags:
- firewall
- openvpn
- ubuntu
---

Say you have configured VPN already and the interface is the default name, `tun0`.

Say you have Transmission installed and want to force it to work through the VPN only.

If installed on ubuntu, it should run as user `debian-transmission` which is a convenient handle by which to control its traffic.

Using iptables, we can, for any process whose owner is debian-transmission:
1. route packets destined to any machine on our LAN (192.168.1.0/24), thus allowing our HTTP client to work
2. after 1., drop packets only if they travel over any interface other than tun0

Thus:

```
iptables -A OUTPUT -m owner --uid-owner debian-transmission -d 192.168.1.0/24 -j ACCEPT 
iptables -A OUTPUT -m owner --uid-owner debian-transmission \! -o tun0 -j REJECT
```

I learned this from http://www.botcyb.org/2012/11/force-application-to-use-vpn-using.html

## Persisting Across Reboots

There are a few ways to do this; here is the way I prefer it.

Save your rules off to a file:

`sudo sh -c "iptables-save > /etc/iptables.rules"`

Add up and/or down hooks to interfaces in `/etc/network/interfaces`, e.g.:

```
auto eth0
iface eth0 inet dhcp
  pre-up iptables-restore < /etc/iptables.rules
  post-down iptables-restore < /etc/iptables.downrules
```

I learned this from https://help.ubuntu.com/community/IptablesHowTo
