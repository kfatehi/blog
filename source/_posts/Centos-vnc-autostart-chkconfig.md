---
date: '2012-07-31'
title: Centos vnc autostart chkconfig
tags: 
- centos
---
<p>Ensure the VNC server (the daemon or server process) is set to autorun on system boots to your runlevel. For example,</p>

<p><code>chkconfig ––list | grep vnc</code></p>

<p>Which returns output like this</p>

<p><code>vncserver 0:off 1:off 2:off 3:off 4:off 5:on 6:off</code></p>

<p>The ––list option of chkconfig shows VNC server is set to auto run in Linux runlevel 5 (the default multi-user runlevel with Linux Desktop console). To configure VNC server to auto run when Linux boots into runlevel 5, use the ––level with on option switch:</p>

<p><code>chkconfig --level 5 vncserver on</code></p>

<p>To check if this configuration works, you can reboot the computer</p>

<p><code>shutdown -r now</code></p>

<p>Tested and worked: April 20, 2010 on Red Hat Enterprise Linux 5.3 and CentOS 5.4 and today July 31, 2012 on CentOS 6.3</p>
