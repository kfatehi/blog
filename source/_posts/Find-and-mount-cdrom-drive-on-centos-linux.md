---
date: '2012-08-03'
title: Find and mount cdrom drive on centos linux
tags: 
- centos
---
<p>Detect the device using <code>wodim --devices</code> and remember the drive name, I&#8217;ll assume it was <code>/dev/scd0</code></p>

<p>Make a directory to mount the device on with <code>mkdir /media/cdrom</code></p>

<p>Mount it with <code>mount -t iso9660 /dev/scd0  /media/cdrom</code></p>

<p>Drive contents can now be found at <code>/media/cdrom</code>. Unmount with <code>umount /dev/sda0</code></p>
