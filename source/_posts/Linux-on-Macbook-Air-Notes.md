---
title: Linux on Macbook Air Notes
date: 2016-03-11 00:25:28
tags:
---

# Goal

I intend to keep Mac OS X on the internal flash drive and run a minimal ubuntu install off a flash drive.

## Target

My target device is a Macbook Air 6.2 (sudo dmidecode | grep Name)

The root disk will be installed on a Samsung Ultra Fit 64GB USB3.0 Flash Drive

## Base Install

I used https://github.com/hartwork/image-bootstrap from another linux machine to write the initial OS to the flash drive.

## Window System

I am using `dwm` compiled from source (suckless.org).

# Troubleshooting (Solved)

## No Sound

After installing ALSA I still had no sound, but I was able to fix it by appending the following to **/etc/modprobe.d/alsa-base.conf**

`options snd-hda-intel model=pch position_fix=1`

After a reboot, I had sound.

# Troubleshooting (Unsolved)

* No horizontal scrolling. [see](http://askubuntu.com/questions/451386/how-to-achieve-multi-touch-gestures-in-ubuntu-14-04)
* Keyboard repeat rate too slow within dwm
* Get 3rd mouse button so I can stop invoking `xclip -o` directly
