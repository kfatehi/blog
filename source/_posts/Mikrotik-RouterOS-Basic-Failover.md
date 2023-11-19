---
title: Mikrotik/RouterOS Basic Failover Script
excerpt: "Keeping your network online when your primary WAN goes offline"
date: 2023-11-18 22:34:45
tags:
- Mikrotik
- RouterOS
---

Inspired by https://rickfreyconsulting.com/basic-failover-with-netwatch/

```RouterOS
# Prerequisites:
#  - Have a primary WAN ethernet interface, e.g.: ether1.
#  - Have a DHCP client on that interface commented as "WAN1"
#    /ip dhcp-client add comment=WAN1 interface=ether1
#  - Have a static route using the primary network gateway with comment "ToCheckWAN1" and ping target 1.1.1.1
#    /ip route add distance=1 dst-address=1.1.1.1 gateway=192.168.1.1 comment=ToCheckWAN1

:local pingResult [/tool ping 1.1.1.1 interface="ether1" count=1]
:local currentDistance [/ip dhcp-client get [find comment=WAN1] default-route-distance]
:if (($pingResult != 0) and ($currentDistance != 1)) do={
    /ip dhcp-client set [find comment=WAN1] default-route-distance=1
    :log info "ether1 is now primary."
}
:if (($pingResult = 0) and ($currentDistance != 10)) do={
    /ip dhcp-client set [find comment=WAN1] default-route-distance=10
    :log info "ether1 is now secondary."
}
```

Install this script in the router and use the scheduler to run it as frequently as you wish.

It will automatically keep your router online by distancing the route of the primary, allowing your secondary to take over routing.

Upon return, your primary will have the route distance reduced, thus taking over from the secondary.