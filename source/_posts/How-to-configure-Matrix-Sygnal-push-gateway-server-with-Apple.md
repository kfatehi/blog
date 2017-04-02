---
title: How to setup Apple push notifications for Riot using your own Sygnal instance
date: 2017-03-27 11:41:21
tags:
- matrix
- riot
- sygnal
---

You will need:
* An active apple developer license
* A server in which to deploy sygnal

Push notifications in Matrix are configured by the client.

This is necessary due to the fact that that push is controlled by the device vendor. In other words, the iOS app tells the homeserver where the Sygnal server with the certificate corresponding to the App's "App ID" is.

So you need to deploy a Sygnal server if you haven't already, and load it with the certificate matching your the App ID you've compiled Riot as.

1. Modify the plist file for Riot, configuring the AppID you'll use and the Push Gateway (Sygnal) URL. This URL is relative to Synapse, as synapse will be the one receiving the messages through other matrix users. It will use this URL to push the notification to your device.
{% asset_img riot-plist.png %}

1. Login to the apple developer portal at https://developer.apple.com

1. Go to the Certificates area, then go to "All", and click the plus button
{% asset_img apple-id-certs-area.png %}
{% asset_img sidebar-all-certs.png %}
{% asset_img new-cert-btn.png %}

1. Choose the correct certificate for push, highlighted in green: {% asset_img correct-selection.png %}

1. Go through the process of acquiring the certificate
{% asset_img request-csr.png %}
{% asset_img request-csr-2.png %}
{% asset_img download-cert.png %}

1. Locate the certificate and keypair, and export it as `p12`.
{% asset_img locate-cert.png %}
{% asset_img export-cert.png %}
{% asset_img export-name-cert.png %}

1. Convert the `p12` file to a `pem` file: 
```
[keyvan@airframe ~]$ openssl pkcs12 -in ~/Desktop/Certificates.p12 -out apns.pem -nodes -clcerts
Enter Import Password:
MAC verified OK
```

1. Configure Sygnal to use this `pem` file:
```
[apps]
pw.keyvan.riot.type = apns
pw.keyvan.riot.platform = sandbox
pw.keyvan.riot.certfile = /mnt/storage/apns.pem
```

## Notes

You may want to do some maintenance on existing pushers in your Synapse database.

To list existing pusher entries:
```
select * from pushers;
```

To delete any existing pusher entries:
```
delete from pushers;
```
