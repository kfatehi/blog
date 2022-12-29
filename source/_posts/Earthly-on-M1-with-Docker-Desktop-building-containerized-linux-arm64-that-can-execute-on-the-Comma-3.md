---
title: >-
  Earthly on M1 with Docker Desktop building containerized linux/arm64 binaries that will
  execute on the Comma 3
date: 2021-12-25 20:56:05
tags:
- comma
- docker
- earthly
- apple silicon
- arm
---

[Earthly](https://earthly.dev) is so useful. Native linux/arm64 builds (which will be the default when running Docker Desktop on an Apple M1 chip) can be shipped directly to and run fine on a Comma 3!

{% asset_img earthly-m1-tici.png %}

Unrelated to Earthly, I hope [this PR](https://github.com/commaai/agnos-builder/pull/29) gets merged where I push docker a bit further to make AGNOS (the ubuntu-based OS that powers the Comma 3) buildable on an M1 machine.

A friend informed me that this chip screams, I didn't believe them at first, but after building a few things with it ([agnos](https://github.com/commaai/agnos-builder), [openconnect](https://www.infradead.org/openconnect/), and others) I ended up [asking the internet why this chip is so fast](https://www.quora.com/Why-is-Apple-s-M1-chip-so-fast-4)!

AGNOS usually takes a day to build with an emulated arm environment from a Ryzen 7 chip. On my M1 Air it took about 20 minutes. I think it spent more time sparsifying the final disk image than actually compiling...