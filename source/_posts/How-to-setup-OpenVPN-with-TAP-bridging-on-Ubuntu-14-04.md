---
title: How to setup OpenVPN with TAP bridging on Ubuntu 14.04
date: 2016-02-10 14:22:44
tags:
- openvpn
- ubuntu
---

I wanted to use Steam's in-home streaming feature outside of my home. It turns out that you can do this via VPN. OpenVPN is relatively simple to setup in TUN mode, but TAP mode is more complicated due to bridging.

It took gathering information from a few different sources (referenced at the end of this article) to produce an up-to-date tutorial for a TAP-based VPN configuration.

## Topology

This is our basic network topology, or rather, the topology we hope to configure towards:

**Router & DHCP Server**
IP: 192.168.1.1
DHCP Range: 192.168.1.10 to 192.168.1.237

**VPN Server**

IP: 192.168.1.206 (DHCP Reservation)
VPN Clients IP Range: 192.168.1.238 - 192.168.1.254

## Server Setup

Install OpenVPN, bridge tools, and Easy-RSA

```
apt-get update
apt-get install openvpn bridge-utils easy-rsa
```

### Configure Bridged Interface

Although you will see examples of bridge configurations with static addresses defined, this did not work for me. I would not be able to access the outside internet. I looked into the ubuntu wiki on bridging (see references) and discovered a configuration for a simple, dhcp based bridge. This worked best for me. Everything after `bridge_ports` is from a different TAP tutorial -- I don't know what they do!

```
auto lo
iface lo inet loopback

iface eth0 inet manual

auto br0
iface br0 inet dhcp
        bridge_ports eth0
        bridge_fd 9
        bridge_hello 2
        bridge_maxage 12
        bridge_stp on
        bridge_prio 1000
```

The simplest way to check this is to reboot `shutdown -r now` and then test if the outside internet is still accessible `ping google.com` and to look at the output of `ifconfig`.

### Configure OpenVPN

Extract the example VPN server configuration into `/etc/openvpn`.

```
gunzip -c /usr/share/doc/openvpn/examples/sample-config-files/server.conf.gz > /etc/openvpn/server.conf
```

Open the server config, e.g. `vim /etc/openvpn/server.conf`

Configure the following, yours may be different depending on your topology:

```
port 1194
proto udp
server-bridge 192.168.1.206 255.255.255.0 192.168.1.239 192.168.1.254
dev tap0
ca ca.crt
cert server.crt
tun-mtu 1454
key server.key  
dh dh2048.pem
up "/etc/openvpn/up.sh br0"
down "/etc/openvpn/down.sh br0"
ifconfig-pool-persist ipp.txt
keepalive 10 600
comp-lzo
persist-key
persist-tun
verb 3
mute 20
status openvpn-status.log
```

Create the scripts that will execute when the OpenVPN service starts and stops. These scripts add and remove the OpenVPN interface to the servers br0 interface.

**/etc/openvpn/down.sh**
```sh
#!/bin/sh
PATH=/sbin:/usr/sbin:/bin:/usr/bin
BR=$1
DEV=$2
brctl delif $BR $DEV
ip link set "$DEV" down
```

**/etc/openvpn/up.sh**
```sh
#!/bin/sh
PATH=/sbin:/usr/sbin:/bin:/usr/bin
BR=$1
DEV=$2
MTU=$3
ip link set "$DEV" up promisc on mtu "$MTU"
if ! brctl show $BR | egrep -q "\W+$DEV$"; then
    brctl addif $BR $DEV
fi
```

Make these scripts executable

```
chmod a+x /etc/openvpn/down.sh /etc/openvpn/up.sh
```

Generate the keys

Copy over the easy-rsa variables file and make the keys directory

```
cp -r /usr/share/easy-rsa/ /etc/openvpn
mkdir /etc/openvpn/easy-rsa/keys
```

Open up `/etc/openvpn/easy-rsa/vars` and configure your defaults, e.g.

```sh
export KEY_COUNTRY="US"
export KEY_PROVINCE="TX"
export KEY_CITY="Dallas"
export KEY_ORG="My Company Name"
export KEY_EMAIL="sammy@example.com"
export KEY_OU="MYOrganizationalUnit"
```

You must also set the `KEY_NAME="server"`, the value is referenced by the openvpn config.

Generate the Diffie-Hellman parameters

```sh
openssl dhparam -out /etc/openvpn/dh2048.pem 2048
```

Now move to the easy-rsa dir, source the variables, clean the working directory and build everything:

```sh
cd /etc/openvpn/easy-rsa
. ./vars
./clean-all
./build-ca
./build-key-server server
```

Make sure that you responded positively to the prompts, otherwise the defaults are `no` and the key creation will not complete.

Next, move the key files over to the openvpn directory

```
cp /etc/openvpn/easy-rsa/keys/{server.crt,server.key,ca.crt} /etc/openvpn
```

You're ready to start the server

```
service openvpn start
service openvpn status
```

If the server is not running, look in `/var/log/syslog` for errors

## Generate Certificates and Keys for Clients

So far we've installed and configured the OpenVPN server, created a Certificate Authority, and created the server's own certificate and key. In this step, we use the server's CA to generate certificates and keys for each client device which will be connecting to the VPN. These files will later be installed onto the client devices such as a laptop or smartphone.

To create separate authentication credentials for each device you intend to connect to the VPN, you should complete this step for each device, but change the name client1 below to something different such as client2 or iphone2. With separate credentials per device, they can later be deactivated at the server individually, if need be. The remaining examples in this tutorial will use client1 as our example client device's name.

As we did with the server's key, now we build one for our client1 example. You should still be working out of `/etc/openvpn/easy-rsa`.

```sh
./build-key client1
```

Again you need to respond positively when presented with yes or no prompts. You should not enter a challenge password.

You can repeat this section again for each client, replacing client1 with the appropriate client name throughout.

The example client configuration file should be copied to the Easy-RSA key directory too. We'll use it as a template which will be downloaded to client devices for editing. In the copy process, we are changing the name of the example file from client.conf to client.ovpn because the .ovpn file extension is what the clients will expect to use.

```sh
cp /usr/share/doc/openvpn/examples/sample-config-files/client.conf /etc/openvpn/easy-rsa/keys/client.ovpn
```

Edit the client profile to reflect your server's IP address and configure it for tap. Also be sure to replace my-server-1 with your VPN server's IP or domain name.

**/etc/openvpn/easy-rsa/keys/client.ovpn**
```
client
dev tap
proto udp
remote my-server-1 1194
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

Finally, you can transfer client1.crt, client1.key, client.ovpn, and ca.crt over to your client. Mac users should use tunnelblick... the process there is simple. Create a directory `foo.tblk` and drop those files in. Double-click it and Tunnelblick handles the rest.

### Export Tunnelblick Config (Mac only)

```sh
cd /etc/openvpn/easy-rsa/keys
rm -rf my-vpn.tblk
mkdir my-vpn.tblk
cp client1.crt my-vpn.tblk/client.crt
cp client1.key my-vpn.tblk/client.key
cp client.ovpn my-vpn.tblk
cp ca.crt my-vpn.tblk
tar -czf my-vpn.tblk.tar.gz my-vpn.tblk
```

TODO: Add part about vpshere/esxi promisc mode

## References

* https://www.digitalocean.com/community/tutorials/how-to-set-up-an-openvpn-server-on-ubuntu-14-04
* https://www.linuxsysadmintutorials.com/setup-openvpn-with-bridging-support-on-ubuntu.html
* https://help.ubuntu.com/community/NetworkConnectionBridge
* http://askubuntu.com/questions/533047/use-steams-in-home-streaming-across-vpn-openvpn
* http://www.evilbox.ro/linux/install-bridged-openvpn-on-ubuntu-14-04-x64-server-and-configure-windows-8-1-x64-client/
* http://unix.stackexchange.com/questions/23004/openvpn-bridge-cant-access-machines-on-local-network
