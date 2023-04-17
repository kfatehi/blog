---
title: How to run exe on Windows as a service with nssm.exe
date: 2023-04-16 19:45:09
tags:
- secureput
- windows
---

Note: this solution ultimately failed to meet the requirement of being able to type text from the service onto the active desktop, but remains here as an example usage of nssm.exe -- I successfully used it to turn telegraf.exe into a service, which does not require the Log On feature at all, so it's even simpler.

Last year I created [secureput.com](https://secureput.com/), although I never wrote about it on this website, to stop typing in the same long passwords over and over.

In my Windows version, which is written in Go, and has an installer, I still could not streamline the creation of a service and eventually ran out of steam to keep hacking on it. It was easier just to put a shortcut in `shell:startup` and call it a day.

{% asset_img explorer_XSre2rLEQ8.png "run command shell:startup to open the startup folder" %}

{% asset_img explorer_V37CoG8MtV.png "easy to add shortcuts to the startup folder" %}

This is okay but not ideal because:
1. it pops open a terminal as of windows 11's new default terminal program which does not yet support the api's that were standard in the old version. this can be worked around by running the old terminal but it's an ugly trick and unnecessary in the context of using a service instead. it also makes the icon look ugly.
2. this will not auto-restart in the event of a crash, so no supervision tree feature. secureput could crash due to being so experimental, it really wants to be a service.

**Before servicifying secureput, be sure to run it at least once directly so that you can perform the pairing process. This is not possible in service mode!**

For windows users there is a very easy way to turn any EXE into a service using [NSSM - the Non-Sucking Service Manager](http://nssm.cc/)

## Acquiring NSSM

Get it and put it somewhere on your computer and update your PATH variable so it is available.

## Create a service

1. Open an admin shell (Search->Powershell->Run As Administrator)
2. Enter `nssm install SecurePut`
3. Click the ellipses and choose the EXE file:
{% asset_img nssm_EmeyHEauMI.png "selected my exe" %}
4. Click the "Log on" tab. SecurePut requires this because it interacts with the desktop
{% asset_img nssm_jmlVRuQSDv.png "set up as a log on service by entering your computer credentials" %}
5. Click "Install Service" and get a confirmation popup
6. Start the service: `nssm start SecurePut`

Now check your mobile app, and you should see your host.

Now for some unknown reason I cannot actually have SecurePut perform its main duty of typing in text for me, so I have to back out of this idea, but at least the above serves as an example of using nssm.

I suspect this has something to do with the change to service security described here https://www.coretechnologies.com/blog/windows-services/interact-with-desktop/