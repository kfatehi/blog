---
title: Blocking Ads with OPNsense's internal dnsmasq
date: 2018-08-27 14:54:32
tags:
- adblock
- opnsense
- dnsmasq
---

I first tried to use UnboundDNS, but it seemed unreliable once modified for adblocking. I later discovered that dnsmasq does everything I expected from Unbound, but with the familiar configuration interface. It’s been battle-tested for adblocking, and so as a pre-requisite, enable and configure that.

Once you’re done, enable SSH and connect to your OPNsense box.

I used my `phosphor` user’s home directory to store my adblock files. Replace my username with yours where applicable

Steven Black maintains a nice hosts file that blocks a lot of things. We will download that and strip out the comments (dnsmasq requires this when loading extra hosts files).

```
mkdir adblock
cd adblock
curl -sSL "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts" | grep 0.0.0.0 | grep -v '#' > hosts
```

Next go to your OPNsense Web GUi and navigate to Services -> Dnsmasq DNS -> Settings

In the Advanced section add the following, replacing my username with yours, or wherever you put your hosts file:

```
addn-hosts=/home/phosphor/adblock/hosts
```

You can add multiple hosts files this way if you wish. Finally click Save and then Apply Configuration.


{% asset_img opn.png opnsense dnsmasq settings %}
￼

Now you can test the adblock. You may need to reset your DNS cache on the clients you are testing. I like to use this site to test:

https://blockads.fivefilters.org

￼
{% asset_img ff.png test results %}


## Hunting DNS queries to block

So dnsmasq can also log queries if you add `log-queries` to the advanced configuration section. Then, the opnsense dnsmasq logs will show queries.

## Also See

* https://pi-hole.net/
* https://github.com/pi-hole/FTL

## Resources

* https://github.com/collinbarrett/FilterLists
* https://raw.githubusercontent.com/StevenBlack/hosts
* https://github.com/pi-hole/FTL
