---
title: >-
  using acme.sh in cloudflare dns mode to easily maintain wildcard ssl
  certificate for apache server on ubuntu 20.04
date: 2021-09-11 20:15:36
tags:
- ubuntu
---

There are many other ACME clients out there, here's a list https://letsencrypt.org/docs/client-options/#acme-v2-compatible-clients but I like
`acme.sh` because it saved me one day when I was desperately searching for a tool I could use without having to fumble with
package managers, so we will explore some more of its capabilities now.

I did all of this as root on a Vultr VM. Install `acme.sh` per https://github.com/acmesh-official/acme.sh/wiki/How-to-install

Let's experiment with the DNS API feature of `acme.sh` per the documentation here https://github.com/acmesh-official/acme.sh/wiki/dnsapi

To take advantage of this, we must start using Cloudflare for DNS. We want to use this for a few reasons:

1. No need to listen on a port on a server to generate valid certs. In fact you don't need any records in your zone at all to do this!
2. We want to generate wildcard certificates. Only the DNS API appears to support this feature, so we need a compatible DNS provider with an API supported by `acme.sh`, hence Cloudflare.

If your domain belongs to some other registrar, you can switch your nameservers over to Cloudflare.

This is important as Cloudflare's DNS API is well-supported by `acme.sh` as this article will demonstrate.

Generate an API token at Cloudflare here https://dash.cloudflare.com/profile/api-tokens

This is one of three inputs required by `acme.sh`; in these next few steps we wish to establish these environment variables. Once you issue the cert, they will be stored in `acme.sh`'s configuration for future use.

```
export CF_Token="" # API token you generated on the site. It should have Zone.DNS edit permission for at least one Zone being the domain you're generating certs for
export CF_Account_ID="" # We will get this in the next step
export CF_Zone_ID="" # We will get this in the next step
```

Once you have set your API token the following will help you get the remaining two. You may want to `apt install -y jq` if you're pasting these commands so the JSON is parsed out for you.

```
curl -X GET "https://api.cloudflare.com/client/v4/zones"  -H "Authorization: Bearer $CF_Token" | jq
```

If you can't read `jq` selectors, you will now, as I'm showing you which key paths get you the AccountID and ZoneID below:

```
zone id: ... | jq '.result[0].id'
```

```
account id: ... | jq '.result[0].account.id'
```

Export those variables too and now you can move on to issuing the cert.

```
acme.sh --issue -d keyvan.pw -d '*.keyvan.pw' --dns dns_cf
```

We got our cert! Install apache now too, enabling SSL while we're at it.

```
apt install -y apache2
a2enmod ssl
a2ensite default-ssl
```

Decide on a location where the certs should be installed to by `acme.sh` and read from by apache, I'm choosing the following:

`mkdir -p /etc/ssl/keyvan.pw`

Make apache point to the files that will exist there very soon. I did this in the default-ssl virtual host apache creates:

```
SSLCertificateFile /etc/ssl/keyvan.pw/keyvan.pw.cer
SSLCertificateChainFile /etc/ssl/keyvan.pw/fullchain.cer
SSLCertificateKeyFile /etc/ssl/keyvan.pw/keyvan.pw.key
```

Now we will use `acme.sh` to install the certs. `acme.sh` is storing all this information for future runs, it's nice like that.

```
acme.sh --install-cert -d keyvan.pw -d '*.keyvan.pw' \
--cert-file /etc/ssl/keyvan.pw/keyvan.pw.cer  \
--key-file /etc/ssl/keyvan.pw/keyvan.pw.key  \
--fullchain-file /etc/ssl/keyvan.pw/fullchain.cer \
--reloadcmd "systemctl reload apache2"
```

Confirm it worked by hitting the website. Did you even bother creating your A record yet? I hadn't yet at this point. This is a nice aspect of using DNS API. It is nice not to actually need a server, yet simply show ownership of the DNS.

Pretty amazing... people used to pay a lot of money and go through a lot more hassle to get this capability. But now within minutes I have proper wildcard and naked domain encryption.

Let's install the cron so this automatically renews.


```
0 0 * * * acme.sh --cron
```

Nice. We can test it with --force too, which I have done. It seems that acme will do everything per previous commands upon renewal including running your reloadcmd, e.g.:

[Sun 12 Sep 2021 02:38:25 AM UTC] Your cert is in: /root/.acme.sh/keyvan.pw/keyvan.pw.cer
[Sun 12 Sep 2021 02:38:25 AM UTC] Your cert key is in: /root/.acme.sh/keyvan.pw/keyvan.pw.key
[Sun 12 Sep 2021 02:38:25 AM UTC] The intermediate CA cert is in: /root/.acme.sh/keyvan.pw/ca.cer
[Sun 12 Sep 2021 02:38:25 AM UTC] And the full chain certs is there: /root/.acme.sh/keyvan.pw/fullchain.cer
[Sun 12 Sep 2021 02:38:26 AM UTC] Installing cert to: /etc/ssl/keyvan.pw/keyvan.pw.cer
[Sun 12 Sep 2021 02:38:26 AM UTC] Installing key to: /etc/ssl/keyvan.pw/keyvan.pw.key
[Sun 12 Sep 2021 02:38:26 AM UTC] Installing full chain to: /etc/ssl/keyvan.pw/fullchain.cer
[Sun 12 Sep 2021 02:38:26 AM UTC] Run reload cmd: systemctl reload apache2
[Sun 12 Sep 2021 02:38:26 AM UTC] Reload success
[Sun 12 Sep 2021 02:38:26 AM UTC] ===End cron===

SSL has never been so cheap, easy, and automatable...