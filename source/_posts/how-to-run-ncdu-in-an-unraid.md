---
title: How to run ncdu in an Unraid
date: 2020-12-26 07:46:29
tags:
- docker
- bash
---

I wish I could run `ncdu` in Unraid but it does not ship there.

Docker does though, can't I use that?

```
$ docker run ncdu
Unable to find image 'ncdu:latest' locally
```

Hmm... nope. Well I know how to get ncdu, can I teach docker how?

```
# Need a place within which to write a Dockerfile...
mkdir -p /tmp/dish/taps/ncdu

# And here's that, it just needs to install a usable ncdu
cat <<EOF > /tmp/dish/taps/ncdu/Dockerfile
from ubuntu
env DEBIAN_FRONTEND=noninteractive
run apt-get update && apt-get install -y ncdu
run mkdir -p /mnt
workdir /mnt
EOF

# Build it
docker build -t ncdu /tmp/dish/taps/ncdu

# I need a place to put my shim bin
mkdir -p /tmp/dish/bin

# Here's the shim bin, it just needs to mount the volume and use ncdu
cat <<EOF > /tmp/dish/bin/ncdu
#!/bin/bash
docker run --rm -v \$(realpath \$@):/dir -it ncdu ncdu /dir
EOF
chmod a+x /tmp/dish/bin/ncdu

# Make the shim accessible
export PATH="/tmp/dish/bin:$PATH"
```

Now I can run `ncdu` in Unraid.

Looks like a neat pattern that comes down to 2 things. Installation and Usage.

We are using docker as a given while populating "taps" (Guess I am stealing a concept from Homebrew) in which we define how to acquire/install a particular tool followed by usage deployed as a binstub or shim or what have you.

If I notice this happening a lot maybe I'll do something about it like make a public registry of these things for different architectures and load it behind a simple curl installer or a plugin to [asdf](https://github.com/asdf-vm/asdf) or something like that.

Thank you for reading. I hope you enjoyed it and learned something useful.