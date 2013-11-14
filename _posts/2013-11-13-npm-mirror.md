---
layout: post
title: "How to setup an NPM mirror"
tags: [npm couchdb]
published: true
---

This tutorial is largely based on [this other tutorial](http://clock.co.uk/tech-blogs/how-to-create-a-private-npmjs-repository).

First off make sure you have a large enough disk drive, I'll update once
my replication is up to date, currently it's only at 2 GB after running
for about 10 minutes.

# Install & Configure CouchDB

## On Mac OS X

1. Use Homebrew to install couchdb: `brew install couchdb` read the
   caveats to make it autostart on reboots
2. Point your browser to the CouchDB configuration page which should now be available at [http://127.0.0.1:5984/_utils/index.html](http://127.0.0.1:5984/_utils/index.html)
3. Click "Configuration" and find `secure_rewrites` and set it to `false`

## On a Raspberry Pi w/ Arch Linux

1. Grab the Arch image from [http://www.raspberrypi.org/downloads](http://www.raspberrypi.org/downloads)
2. Determine the device path for your SD card with `df` at the terminal.
2. Unzip and then `dd` the image to path you found: `sudo dd bs=4m
   if=/path/to/img of=/dev/mysd` make sure you point to the card and not
the partition (e.g. /dev/disk1, not /dev/disk1s1)
3. Install couchdb -- still doing this -- will update after I learn to use `pacman`

# Tell CouchDB to replicate continuously from NPM

Open terminal and enter the following to setup continuous replication
   from the official npm registry:

```
curl -X POST http://127.0.0.1:5984/_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"registry", "continuous":true, "create_target":true}' -H "Content-Type: application/json" 
```

# Tell CouchDB to stop replicating

In case you ever need it:

```
curl -X POST http://127.0.0.1:5984/_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"registry", "continuous":true, "create_target":true, "cancel":true}' -H "Content-Type: application/json" 
```

# Finalizing the installation

This information can also be found here [https://github.com/isaacs/npmjs.org](https://github.com/isaacs/npmjs.org). That link will also explain how to tell `npm` to use your new registry.

```
git clone git://github.com/isaacs/npmjs.org.git
cd npmjs.org
sudo npm install -g couchapp 
npm install couchapp 
npm install semver 
couchapp push registry/app.js http://localhost:5984/registry 
couchapp push www/app.js http://localhost:5984/registry 
```

# Testing the installation

```
npm --registry http://localhost:5984/registry/_design/scratch/_rewrite login
npm --registry http://localhost:5984/registry/_design/scratch/_rewrite search
```

