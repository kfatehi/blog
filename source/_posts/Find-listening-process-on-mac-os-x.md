---
date: '2014-09-05'
title: Find listening process on mac os x
tags:
- osx
---

Let's say you have something listening on port 4000, when you hit that port nothing happens, and you can't start any services on that port because something is using it.

On Mac you can find out what process is using it by executing `lsof -i :4000`

This command will show you the program, pid, and many other pieces of information you can use to track down and kill the process.
