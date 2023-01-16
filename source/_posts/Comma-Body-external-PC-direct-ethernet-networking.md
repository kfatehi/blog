---
title: Comma Body external PC direct ethernet networking
date: 2023-01-15 17:28:35
tags:
- comma
- comma body
- bash
- networking
- linux
---

Lately I have been working on the comma body, specifically merging it with a small but capable PC for the purpose of unlocking webrtc streaming and other features.

{% asset_img comma-body-latency.jpg acceptable latency webrtc %}

This is fine but I realized with a bit more effort we could eliminate the router, reducing complexity and maybe improving latency further. Notice the much cleaner look too:

{% asset_img comma-body-external-pc.png nice cable management %}

This guide sparked a more sophisticated bit of tooling which can be found https://github.com/kfatehi/comma-body-hacks but the following techniques apply to linux machines in general and so it is worth publishing before further pigeonholing it into highly customized scripts. Hope you find the information in a random google search and it helps you!

# Utilizing Comma Prime to SSH into a computer physically connected via direct ethernet cable

Login to Comma Connect to get your dongle ID https://connect.comma.ai

```bash
export DONGLE_ID=<DONGLE ID>
```

# SSH into the Device

```bash
ssh -o ProxyCommand="ssh -W %h:%p -p %p %h@ssh.comma.ai" comma@$DONGLE_ID
```

# Ensure that eth0 has an IP address

```bash
sudo ip addr add 192.168.0.1/24 dev eth0
```

# Start the DHCP server

```bash
cat <<EOF > /tmp/dnsmasq.conf
port=0
interface=eth0
dhcp-range=192.168.0.50,192.168.0.150,12h
dhcp-leasefile=/tmp/dnsmasq.leases
bind-dynamic
EOF
```

```bash
sudo dnsmasq -d -C /tmp/dnsmasq.conf
```

# The IP address will be made visible. Now you can proxy in.

```bash
ssh -t -o ProxyCommand="ssh -W %h:%p -p %p %h@ssh.comma.ai" comma@$DONGLE_ID ssh -t "body@\$(cat /tmp/dnsmasq.leases | awk '{print \$3}')"
```

# Now you can configure the wireless network or whatever else you need to do.

```bash
nmcli dev wifi list
sudo nmcli --ask dev wifi connect network-ssid
# or use the ncurses terminal-based UI interface: nmtui
```


Further work on this topic can be found here https://github.com/kfatehi/comma-body-hacks