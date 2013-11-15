---
layout: post
title: "How to setup an NPM mirror on a Raspberry Pi running Arch Linux"
tags:
  - npm
  - nodejs
  - couchdb
  - raspberry pi
  - arch linux
published: true
---

This tutorial is my version of [this other tutorial](http://clock.co.uk/tech-blogs/how-to-create-a-private-npmjs-repository).

First off make sure you have a large enough disk drive, I'll update once it has completed but I think at least 256GB will be the minimum requirement.

# Install & Configure CouchDB

## On Mac OS X

1. Use Homebrew to install couchdb: `brew install couchdb` read the
   caveats to make it autostart on reboots
2. Point your browser to the CouchDB configuration page which should now be available at [http://127.0.0.1:5984/_utils/index.html](http://127.0.0.1:5984/_utils/index.html)

## On a Raspberry Pi w/ Arch Linux

1. Grab the Arch image from [http://www.raspberrypi.org/downloads](http://www.raspberrypi.org/downloads)
2. Determine the device path for your SD card with `df` at the terminal.
2. Unzip and then `dd` the image to path you found: `sudo dd bs=4m
   if=/path/to/img of=/dev/mysd` make sure you point to the card and not
the partition (e.g. /dev/disk1, not /dev/disk1s1)
3. Insert the SD card, start the Pi, and ssh into it (root/root)
8. Format your external drive, ensure it is mountable,
   and that your `/etc/fstab` is set to
   automount it. Use `lsblk -f` to discover it. If you need more help check
this [ArchWiki Page](https://wiki.archlinux.org/index.php/USB_Storage_Devices)
4. Download some packages: `pacman -Sy couchdb` for more info see this [ArchWiki Page](https://wiki.archlinux.org/index.php/couchdb)
6. Edit `/etc/couchdb/local.ini` and set `;bind_address = 127.0.0.1` to `bind_address = 0.0.0.0` if you want to access it from another system
7. Edit `/etc/couchdb/local.ini` and under `[couchdb]` add these 2 lines, per your storage location:
   `database_dir = /media/storage/couchdb` and `view_index_dir = /media/storage/couchdb`
8. Give the couchdb daemon permission to write to your external storage:
   `chown couchdb:daemon /media/storage`
6. Setup couchdb to autostart after reboot `systemctl enable couchdb`
5. Start couchdb with `systemctl start couchdb`
7. Connect to Futon using `your-ip:5984/_utils`

## CouchDB configuration continued

Now you have CouchDB installed and can access Futon and hopefully the
internet.

From Futon click "Configuration" and find `secure_rewrites` and set it to `false`

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

# Making sure that it keeps replicating

There's an unfortunate issue that I'm experiencing with couchdb, but it may
just stop replicating often only after transferring 5-7 GB of
data -- a trivial retrigger of the replication with the above command 
would cause it to pick up where it left off, so I've developed a script.

1. Install nodejs
2. `npm install npm-replication-watcher`
3. `npm install forever`
4. `forever start ./node_modules/npm-replication-watcher/bin/npm-replication-watcher`

For more information check out
[npm-replication-watcher](https://github.com/keyvanfatehi/npm-replication-watcher)

# Finalizing the installation

This information can also be found here [https://github.com/isaacs/npmjs.org](https://github.com/isaacs/npmjs.org). That link will also explain how to tell `npm` to use your new registry.

1. `git clone git://github.com/isaacs/npmjs.org.git`
2. `cd npmjs.org`
3. `sudo npm install -g couchapp`
4. `npm install couchapp`
5. `npm install semver`
6. `couchapp push registry/app.js http://localhost:5984/registry`
7. `couchapp push www/app.js http://localhost:5984/registry` 

# Testing the installation

1. `npm --registry http://localhost:5984/registry/_design/scratch/_rewrite login`
2. `npm --registry http://localhost:5984/registry/_design/scratch/_rewrite search`

