---
title: Winbox on Linux through Docker
date: 2020-10-14 18:11:08
tags:
- mikrotik
- docker
- wine
- linux
- networking
---

Discovered [an excellent wine in docker solution](https://github.com/yantis/docker-wine) today and so I thought it would be fun to use it to run winbox on my linux laptop. This was very easy to do, with great results, so I am writing it here for future use.

{% img https://imgur.com/7GX8dio.gif %}

## You will need:

* A working docker installation in Linux
* A NIC for docker to bridge for use by winbox

1. Create directories for wine data and templates
`mkdir -p ~/docker-data/{wine-data,wine-templates}`
1. Write the winbox wine template script:
```bash
cat <<EOF > ~/docker-data/wine-templates/winbox.template
#!/bin/bash
export WINEPREFIX=/home/docker/wine/winbox
export WINEARCH='win32'
if [ ! -f /home/docker/wine/winbox/drive_c/winbox/winbox.exe ]
then
    winetricks liberation corefonts
    mkdir -p /home/docker/wine/winbox/drive_c/winbox
    cd /home/docker/wine/winbox/drive_c/winbox
    curl -SLo winbox.exe https://mt.lv/winbox
fi
wine /home/docker/wine/winbox/drive_c/winbox/winbox.exe
exit
EOF
```
2. Write the docker run script. Be sure to update the parent NIC specified with yours.
```bash
cat <<EOF > ~/docker-winbox.sh
xhost +si:localuser:$(whoami) >/dev/null
docker network create -d macvlan -o parent=enp7s0 winbox_net
docker run \
  --rm \
  -ti \
  --network=winbox_net \
  -e DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v ~/docker-data/wine-templates:/mnt \
  -v ~/docker-data/wine-data:/home/docker/wine/ \
  -u docker \
  yantis/wine sh /mnt/winbox.template
docker network remove winbox_net
EOF
chmod +x ~/docker-winbox.sh
```
4. Execute it as needed, but first read the note below
`~/docker-winbox.sh`

The first execution will try to download assets from the web such as fonts for wine and the executable to winbox itself. These get cached and internet access is not needed for subsequent invocations. Running a custom network is liable to break the internet within the container, so execute the following in order to get everything cached, and then flip back to the script for future invocations.

```bash
xhost +si:localuser:$(whoami) >/dev/null
docker run \
  --rm \
  -ti \
  -e DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v ~/docker-data/wine-templates:/mnt \
  -v ~/docker-data/wine-data:/home/docker/wine/ \
  -u docker \
  yantis/wine sh /mnt/winbox.template
```

## Reference

https://docs.docker.com/network/macvlan/
https://hicu.be/macvlan-vs-ipvlan