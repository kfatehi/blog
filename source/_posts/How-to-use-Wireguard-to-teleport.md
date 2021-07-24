---
title: How to use Wireguard to teleport
date: 2021-07-24 14:35:31
tags:
- wireguard
- privacy
---

I obviously mean the typical use case for VPN, that is to hide your location.

In this example we will use wireguard to setup the following:

(Different Private Locations) <-> Frankfurt VPS <-> NJ VPS <-> USA websites

Your adversaries will see you connect to Frankfurt. Why Frankfurt? Well perhaps it's a modern 1984 and you've found yourself in Oceana, Eurasia, Eastasia, and the safest hop to which your adversaries might find acceptable for you to communicate some soccer video game traffic to is Germany. I'm of course kidding around, gotta have fun right?

Anyway let's configure our first hop, which is the most interesting part of the puzzle:

## Frankfurt VPS

This is the entrypoint from the private location. (Entrypoint... hmm, sounds like I've been influenced by Docker)

First step let's create the wireguard server that private client will connect to.

We'll use an innocuous port commonly used for a popular video game (some kind of soccer game that's popular over there, I don't remember which, and it does not matter)... and NAT all our traffic through this server.

Forgot how to generate wireguard keys? Go to the official site, it's all there. https://www.wireguard.com/quickstart/ If you want to use PreShared keys it's `wg genpsk`

**/etc/wireguard/wg0.conf**

```
# Privacy centric for world travel...
# https://stanislas.blog/2019/01/how-to-setup-vpn-server-wireguard-nat-ipv6/
# seems the nat was wrong, took a tip from this one:
# https://www.cyberciti.biz/faq/how-to-set-up-wireguard-firewall-rules-in-linux/

[Interface]
Address = 192.168.72.1/24,fd42:42:42::1/64
ListenPort = 3074
PrivateKey = EJ0CD4P3zWVt+g1A4ChREKUDyIAyUZXgFrNuZ/74FkE=
PostUp = iptables -t nat -I POSTROUTING 1 -o wg2 -j MASQUERADE; ip6tables -t nat -A POSTROUTING -o wg2 -j MASQUERADE
PostDown = iptables -t nat -D POSTROUTING -o wg2 -j MASQUERADE; ip6tables -t nat -D POSTROUTING -o wg2 -j MASQUERADE

# CM
[Peer]
PublicKey = wfe8LVgrAZTWNzvbkdL2W0niC11js5W6cbbd1lkVu2I=
PresharedKey = oZKkM8BhuAwn5fE19lMSW4g5xHhPIuE1DvpcOD01mhE=
AllowedIPs = 192.168.72.2/32, fd42:42:42::2/128

# MBP
[Peer]
PublicKey = AHBG1wxNFEnati+CyZNiX1n77o+2bXjEGltt+qP+4yQ=
PresharedKey = njYfVgSUfbKuh24gqUjVxNBaEOpaUvslc2w5iUzDuYU=
AllowedIPs = 192.168.72.3/32, fd42:42:42::3/128
```

But we don't want to stop there...
We want traffic to flow on to a US-based server that we can also control.
This traffic will be private, within the wireguard network, so your adversaries will just see your game server playing another video game...
Create a wireguard config that will connect to our New Jersey VPS:

**/etc/wireguard/wg2.conf**

```
# Connect us up to the NJ Vultr to NAT Frankfurt's traffic


[Interface]
PrivateKey = 4CAO8fbl44iJLUmDzL2/CIyylrc9a4GFb/OWgvJ3M1g=
Address = 192.168.73.2/32
# We create static routes for NJ endpoint so wireguard can
# directly connect to it from frankfurt.
PreUp = ip route add 149.28.238.111/32 via 136.244.90.1 dev enp1s0
PostDown = ip route del 149.28.238.111/32 via 136.244.90.1 dev enp1s0

[Peer]
PublicKey = PVWMKvd5YL62Mmcndhpo2d1pibFl9l4jzujphDguClw=
#AllowedIPs = 192.168.73.0/24
AllowedIPs = 0.0.0.0/0
Endpoint = 149.28.238.111:28001
PresharedKey = BGdHfH7rus9CL+xaeg7ucws8fAw1R8jZegqRMi9g/mI=
PersistentKeepalive = 25
```

We will have routing table issues, so let's handle that with some ruby...

As I wrote in the comment at the time...

  This watches for wg0 connections and automatically add/removes routes
  so that i can be mobile yet still appear from NJ regardless of where I
  connect to the frankfurt rig from

**/usr/local/bin/wg-route**

```ruby
#!/usr/bin/ruby
# basically reason for the script is that the peer might connect from different ips
# and we need to make sure this ip is exempted from being routed through NJ
# because it's trying to connect by way of this server, so this server needs
# to make sure to route its packets back directly to the peer rather than to
# pass it through to the NJ. ok make sense? lets do it
# the caveat here is we need to delete the routes so the way we will do this
# is detect superfluous routes:
def the_business
  deleting = `ip route | grep 'via 136.244.90.1 dev enp1s0'`.split("\n").reject{|a|
    a.include? "default" or a.include? "149.28.238.111" or a.include? "dhcp"
  }.map(&:strip)
  # k now get the ones we wanna add...
  adding = []
  `wg show wg0 endpoints`.split("\n").each do |line|
    a = line.match(/\s(.+):/);
    adding << "#{a[1]} via 136.244.90.1 dev enp1s0" if a and a[1]
  end

  operations = [];

  deleting.each do |aa|
    if adding.include? aa
      # no op
      # operations << "ip route add #{aa}"
    else
      operations << "ip route del #{aa}"
    end
  end

  adding.each do |aa|
    if deleting.include? aa
      # no op
      # operations << "ip route add #{aa}"
    else
      operations << "ip route add #{aa}"
    end
  end

  operations.each do |op|
    puts op
    `#{op}`
  end
end

while true
  the_business
  sleep 1
end
```

In the above script, the hardcoded IP and device name would need to change. These are just the IP address given by the platform company (Vultr in this case), and the network interface name.

Moving on to the systemd service unit...

**/etc/systemd/system/wg-route.service**

```
[[Unit]
Description=automatic route modifier for wireguard connections
After=network.target

[Service]
ExecStart=/usr/local/bin/wg-route

[Install]
WantedBy=multi-user.target
```

Frankfurt is done, start up the services and move on to the New Jersey VPS...

```
systemctl start wg-quick@wg0.service
systemctl start wg-quick@wg2.service
```

Where's wg1? I had used that to connect back to a Dallas VPS which connects a few other things like home, office, etc.

It's really great to learn how basic routing works, and with wireguard it seems anything is possible with relative ease, as this exercise seems to reveal.

Anyway, NJ:

## NJ VPS

Picking another gaming port just to throw them off some more. Frankly I can't tell the difference anymore.

**/etc/wireguard/wg0.conf**

```
[Interface]
Address = 192.168.73.1/24,fd43:43:43::1/64
ListenPort = 28001
PrivateKey = qJ27Yexad0SpxqTE9PJYztbnFUHvRPBOXlJW39/EyEc=
PostUp = iptables -t nat -I POSTROUTING 1 -o enp1s0 -j MASQUERADE; ip6tables -t nat -A POSTROUTING -o enp1s0 -j MASQUERADE
PostDown = iptables -t nat -D POSTROUTING -o enp1s0 -j MASQUERADE; ip6tables -t nat -D POSTROUTING -o enp1s0 -j MASQUERADE

# Frankfurt
[Peer]
PublicKey = WbFx788jJCveovWh9FXtvr2P3+ejfSHq+yGer0eL+kA=
PresharedKey = BGdHfH7rus9CL+xaeg7ucws8fAw1R8jZegqRMi9g/mI=
AllowedIPs = 192.168.73.2/32, fd43:43:43::2/128
```

We're all set!

Wait, what about the clients?

Well you saw # MBP and # CM, those are my macbook and my windows computers. The clients are simple... Here's MBP:

```
[Interface]
PrivateKey = 0DiWQ7lzb+CebbCzEjMHPEc61sa9QxkVPXwlOgoqq1k=
Address = 192.168.72.3/24, fd42:42:42::3/64
DNS = 192.168.72.1, fd42:42:42::1

[Peer]
PublicKey = AhYS6H9vIxDGHFTVqsZaLjh+5X6ga77CoQEE95oEcAU=
PresharedKey = njYfVgSUfbKuh24gqUjVxNBaEOpaUvslc2w5iUzDuYU=
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = 136.244.90.84:3074
PersistentKeepalive = 25
```

Here's # CM

```
[Interface]
PrivateKey = yMeXMK6CzjBcuYowF4lJ6qC055bW2jrUhPQ9I8zsNl8=
Address = 192.168.72.2/24, fd42:42:42::2/64
DNS = 8.8.8.8, 8.8.4.4

[Peer]
PublicKey = AhYS6H9vIxDGHFTVqsZaLjh+5X6ga77CoQEE95oEcAU=
PresharedKey = oZKkM8BhuAwn5fE19lMSW4g5xHhPIuE1DvpcOD01mhE=
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = 136.244.90.84:3074
PersistentKeepalive = 25
```

**Everything here has since been deleted, so don't judge me for not scrubbing keys, IPs, etc, again this was just an exercise and is here for reference to those that actually might need it and don't have time to hack and slash/search their way to a working setup!**

Perhaps in the future I'll expand on this to have another port to effectively replace NJ with a home computer since certain websites will flag "normal web traffic" coming from a VPS/datacenter but not residential ISPs.

Something like this: Private Location <-> Frankfurt VPS <-> USA Home Computer <-> USA websites

I hope this showcases how powerful wireguard can be and provides some examples for those searching and dealing with this problem-set looking for reference.

Luckily I do not have a need for such capabilities, but it is good to know it can be done so easily and how. Reinforces my faith in humanity in some ways, and given world events over the last few years man do I appreciate the reinforcement.

**Since learning mikrotik last year, and wireguard this year, I've found myself using this routing knowledge and especially wireguard daily for both home (mobile access to home network resources) and work (work from home problem-sets, connecting servers together to expose a private service to some employees, etc), this exercise is just another example of an important use case which wireguard solves perfectly. What an incredible piece of software.**