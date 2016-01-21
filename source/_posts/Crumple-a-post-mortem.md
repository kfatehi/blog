---
title: 'Crumple, Inc.: a startup post-mortem'
date: 2016-01-19 15:00:11
tags:
  - startup
  - beaglebone
---

Crumple is the startup idea of an old friend of mine from high school. Knowing that I can develop whatever, he presented me with his pitch and I thought:

> Hell yes! You're right! Paper receipts have got to go! I will gladly build it if you will sell it.

{% asset_img landing.png This is an example image %}

**We went to work...** My co-founder was responsible for the business aspects, and I was responsible for the technical aspects. We would consult with each other on as much as we could. What could go wrong?

Unfortunately we were far too optimistic about our project. We'd later discover we were so very very wrong.

Sadly, we didn't realize this until we had build a complete platform and spent quite a bit of [our own] money. Some of the resulting code is worth discussing and releasing, before it falls into the abyss of proprietary abandonware. In addition, the business lessons are valuable and worthy of reflection.

_If I didn't provide a link to source code for a given project, it means I didn't think it useful or general enough to spend the effort moving the code out of my GitLab server. For the curious, feel free to email me and I am happy to share._

## The Software

By September 2015, we'd been at it for 9 months straight -- we'd designed, built, and deployed the entirety of the Crumple platform... complete with tests and CI (because that's how I do things). It was my co-founder's time to shine on the business front (more on this later)... Until then, let's look at the software:

### VirtualPrinter (ESC/P Parser)

[source code](https://github.com/kfatehi/virtualprinter)

This is one of the first and most challenging things I wrote for Crumple.

It is a JavaScript module that we used for parsing and converting Epson Standard Code escape sequences to HTML receipts on the smartphone.

We also used it in the Terminal under Node.js to determine attributes of a print payload in order to employ rules defined for a given store.

### The Terminal

The name we used for our custom software and the physical beaglebone black it runs on. It runs Debian and Node.js to capture receipts and send it to the backend.

It operates as a physical **Man in the Middle** between the point of sale and the receipt printer. It supports serial (FTDI) and/or the beaglebone's USB client interface with the ability to masquerade as a printer.

It kept a persistent connection with the backend via WebSocket and sent its logs to [papertrail](https://papertrailapp.com).

It broadcasted a Bluetooth Low Energy signal which enabled the mobile app to receive receipts over the air when in close proximity.

### The Workbench

This project provides a command line interface for setting up Terminals from scratch.

This project made it ridiculously easy and automatic to setup new units. The web application would even show the commands to enter (e.g. when creating a new terminal for a store in the web app), making it so all a technician had to do was copy paste the command and run it with a freshly flashed beaglebone.

It was inspired by Ansible in that all the configuration was done idemptotently via SSH, except that in our case, the network was not available so I used the serial debug cable for everything. The technician simply plugged the debug cable in and invoked the CLI and waited for a success message from the web interface, as notified by the Terminal app's websocket coming online!

### The Web App

It provides the admin portal, customer portal, and mobile app API. Of course all the database and pub/sub stuff is here too. We used PostgreSQL's NOTIFY feature for our PubSub, keeping the stack super lean (i.e. no need for Redis in order to scale horizontally). This worked very well, although I had the opportunity to stress this at scale.

### The Mobile App

We used Ionic to implement our Android and iOS app. The thing that was particularly special here was the way we achieved over-the-air receipt transfers.

It was pretty magical to hover the phone over the Tablet and receive your receipt and see it rendered directly onto your smartphone.

### The Tablet

An android app that would auto-discover the Terminals on the LAN and bind to them with a WebSocket. It works in a "Kiosk Mode" and was the customer-facing interface to the Terminal.

Users would use this to select how to get their receipt, enter email address, tip and sign (if credit card transaction).

{% asset_img idle.png Idle screen %}
{% asset_img sign.png Signing screen seen for credit card transactions %}
{% asset_img tip.png Enter a tip amount %}
{% asset_img ble-start.png Many choices %}
{% asset_img ble-pin.png The pin code was a security compromise %}
{% asset_img ble-done.png Receipt arrives over the air like magic %}

## Business Post Mortem

Anyway, despite the technology, the business failed. My co-founder got burned out and quit and I had full-time classes -- plus, from the start I had indicated zero interest in running the business side of things.

To put a point of finality on things, my co-founder wrote a document outlining what went wrong. I've quoted it below:

> Hardware was not the correct way to implement paperless receipts. Hardware is very expensive and support is very cost intensive. With thousands of customers it would be very expensive to provide support to these stores. A software solution made far more sense (the cost in gas and time for my support visits to g burger and yogurt bar kill our profit margins).

I wish we knew this sooner!

> The target market is very difficult to penetrate. SMB’s will spend money on things they absolutely need. Things like square and clover worked for SMB’s because it solved a big problem they had (accepting credit cards and a low price POS system). For the larger retail stores they already offer email receipts via a software solution and they don’t have to deal with problem #3.

I wish we knew this sooner too!

> We not only needed to sell to businesses but we also needed to sell to the customers. Even after a store has Crumple, the cashiers or business owners must sell Crumple to customers. This was not an easy task. At both g burger and yogurt bar a very small percentage of customers actually used the Crumple app (less than 1 percent of customers). The reason email receipt is far more common is because nearly everyone has an email address. You don’t need to sell them on an additional step in order to take advantage of the service.

We knew this, but it didn't deter us from proceeding anyway.

> Poor Sales/Distribution Strategy. The person in charge of sales and marketing was completely clueless and had no prior experience. There was no clear plan on how to get Crumple to business owners.

Although he is right, my co-founder is just being self-deprecating here.

> No product market fit. Even for the two businesses we did acquire as “customers”, neither truly loved the product. It’s not a product that they can’t live without. We also didn’t achieve product market fit with customers. For those who downloaded the app, very few were repeat users. Most only used it once or never used it at all.

This doesn't seem like something we could have known until we tried.

> We built too fast. We rushed it. With more market research and by surveying business owners we would have realized points 1­5 and potentially saved ourselves time and money. Its very crucial to build something that solves a big problem and that people really want it.

I should have stuck to my guns early on when I initially proved the technology -- but I allowed myself to be convinced by my co-founder that we needed "the real product" and "just one more feature" over and over again.

I would say "Lesson Learned" but I have a feeling that this experience requires further analysis before its lessons are fully internalized.
