---
title: 'How to build a telescope service'
layout: post
category : blog
tags : ['song', 'telescope', 'ai', 'cameras']
---
{% include JB/setup %}

Wish you collected more cool data? Want to bring proper streaming telescope services to the masses from inside the browser? It's due time we get this right, by building the first well-done telescope service.

Here's how you might do it:

## Hardware

Buy a good telescope
* [Must have GoTo feature](http://www.celestron.com/astronomy/series/advanced-series-gt-computerized-telescopes/)
* [Something about nexstar?](http://www.celestron.com/astronomy/celestron-nexstar-5se.html) Not sure, see github repo link below.

Mount on a high-altitude home in the Hollywood Hills (avoid smog and light pollution) with a high speed connection

Attach telescope lens to android device at the camera [HTC One](http://www.htc.com/us/smartphones/htc-one/?PS=1&cid=sem157p174347&gclid=COf2jK2u97cCFRHhQgodhwoAGg)

I would recommend designing this in solidworks and printing the mount for the best results.

Use a Raspberry Pi the basis of your compute platform.

Design and supply over USB an API to the weather protector

Suppply over USB ambient temperature and weather sensor data

## Software

Setup https://github.com/fcsonline/node-telescope-server

Build a IRC-like single-operator chatroom system

Implement (port?) [Stellarium](http://www.stellarium.org/)-like system in the browser.

Display camera live feed.

Allow capture of the Android camera's feed to LocalStorage.

Allow operators to implement and run scripts from the web browser, a la:

    Keep a video running with a high speed camera sensor
    Constantly adjust focus to detect movers
    When detected, focus in on the mover and follow it
    Repeat

    Dump all activity (images, video, events) into ES/MD w/ odata

Fun Links:

[OData API Explorer](http://services.odata.org/ODataAPIExplorer/ODataAPIExplorer.html)

{% youtube XfIU9DqPTl8 %}