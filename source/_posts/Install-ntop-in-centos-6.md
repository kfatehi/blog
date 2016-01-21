---
date: '2012-09-13'
title: Install ntop in centos 6
tags: 
- centos
---

Source: https://ryanwoon.wordpress.com/2011/08/20/install-ntop-in-centos-6/

```sh
yum install cairo-devel libxml2-devel pango-devel pango libpng-devel
yum install freetype freetype-devel libart_lgpl-devel wget gcc make
yum install perl-ExtUtils-MakeMaker
cd /opt
wget http://oss.oetiker.ch/rrdtool/pub/rrdtool-1.4.5.tar.gz
tar -zxvf rrdtool-1.4.5.tar.gz
cd rrdtool-1.4.5
./configure –prefix=/usr/local/rrdtool
make
make install

yum install libpcap libpcap-devel gdbm gdbm-devel
yum install libevent libevent-devel
wget http://geolite.maxmind.com/download/geoip/api/c/GeoIP-1.4.8.tar.gz
tar -zxvf GeoIP-1.4.8.tar.gz
cd GeoIP-1.4.8
./configure
make
make install

yum install libtool automake autoconf
wget http://downloads.sourceforge.net/project/ntop/ntop/Stable/ntop-4.1.0.tar.gz
tar zxvf ntop-4.1.0.tar.gz
cd ntop-4.1.0
./autogen.sh -prefix=/usr/local/ntop
make
make install

useradd -M -s /sbin/nologin -r ntop
chown ntop:root /usr/local/ntop
chown ntop:ntop /usr/local/ntop/share/ntop

cd /usr/local/ntop/bin/
ntop -A

ntop -d -L -u ntop -P /usr/local/ntop –-skip-version-check –-use-syslog=daemon
```

