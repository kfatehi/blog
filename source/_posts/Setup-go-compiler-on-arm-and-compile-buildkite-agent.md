---
date: '2015-07-20'
title: Setup go compiler on arm and compile buildkite agent
tags:
- ci
- beaglebone
- golang
---

Notes getting buildkite agent running on BeagleBone/ARM7

Beaglebone Black running Debian

Linux arm-worker 3.8.13 #1 SMP Mon Sep 22 10:22:05 CST 2014 armv7l GNU/Linux

After some failed attempts with default sources and unmaintained PPA's, I found Dave Cheney's website where he distributes ARM tarballs of Go: http://dave.cheney.net/unofficial-arm-tarballs

```bash
# Get mercurial, need it later for some packages
apt-get update
apt-get install mercurial

# Get Go
wget http://dave.cheney.net/paste/go1.4.2.linux-arm~multiarch-armv7-1.tar.gz
sha1sum go1.4.2.linux-arm~multiarch-armv7-1.tar.gz
# should be 607573c55dc89d135c3c9c84bba6ba6095a37a1e

tar -zxvf go1.4.2.linux-arm~multiarch-armv7-1.tar.gz

# Setup your Go installation
export GOROOT=$HOME/go
export PATH=$PATH:$GOROOT/bin

# Setup your GOPATH
export GOPATH="$HOME/Code/go"
export PATH="$HOME/Code/go/bin:$PATH"

# Get godep
go get github.com/tools/godep

# Checkout the code
mkdir -p $GOPATH/src/github.com/buildkite/agent
git clone git@github.com:buildkite/agent.git $GOPATH/src/github.com/buildkite/agent
cd $GOPATH/src/github.com/buildkite/agent
godep get

# Test it
go run *.go start --debug --token "abc123" --bootstrap-script templates/bootstrap.sh --build-path ~
```
