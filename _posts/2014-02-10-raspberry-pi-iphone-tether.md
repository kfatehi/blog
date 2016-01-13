---
layout: post
title: "How to setup iPhone tethering on Raspberry Pi"
tags:
  - iphone
  - ios
  - raspberry pi
  - raspbian
  - arch linux
published: true
---

# iPhone Tethering on Raspberry Pi

The instructions here are useful although the current packages in Arch and Debian repositories do not work with iOS 7 (Trust Loop Bug) but it is still a good starting point to understand how this works.

https://wiki.archlinux.org/index.php/IPhone_Tethering

## iOS 7 Support

### Install libimobiledevice from latest source

In order to get iOS 7 support, we need to compile everything from source. Find the scripts for ArchLinux and Raspbian here: [https://gist.github.com/kfatehi/8922430](https://gist.github.com/kfatehi/8922430)

## Usage

### Mounting your iPhone

Start usbmuxd: `usbmuxd`

Create a mount point: `mkdir /media/iphone`

Mount the device: `ifuse /media/iphone`

(You can unmount using `umount /media/iphone`)

You should now be able to view the contents of your iPhone.

### Networking

At this point you should reboot so that modules and rules get loaded. After that, I gave up on ArchLinux due to issues getting actual network traffic to go across, so I can't speak for ArchLinux from herein. However I did have success on Raspbian. You should be able to simply plug in your iPhone and see a new interface come up and be able to ping the outside world. Enjoy!

