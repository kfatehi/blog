---
title: iOS/iPhone Safari embedded HTML5 MP4 video ffmpeg encoder and range header server requirements
date: 2021-11-28 15:47:24
tags:
  - video
  - ios
  - iphone
  - ffmpeg
---

In my previous post I tried to embed a short demo video, which reminded me of how strict Apple Safari on iOS is. 

<a href="https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/CreatingVideoforSafarioniPhone/CreatingVideoforSafarioniPhone.html#//apple_ref/doc/uid/TP40006514-SW4">Apple has documented these details here</a>, but it boils down to adherence to strict encoding and serving requirements.

## Video must be encoded to Apple's liking

I am encoding like this now for iPhone embedding. The filter-complex is because it also appears to me that resolution must be standard, so when I crop out a strange resolution (ironically, I do this directly on an iPhone...) I seem to have to fill it back in, so that's what this filter does, using a blur effect:

```
#!/bin/bash
# Usage: this_script.sh input_file output_file
ffmpeg -an -i $1 -c:v libx264 -profile:v baseline -level 3.0 -c:a aac -movflags +faststart \
-filter_complex "[0:v]scale=ih*16/9:-1,boxblur=luma_radius=min(h\\,w)/20:luma_power=1:chroma_radius=min(cw\\,ch)/20:chroma_power=1[bg];[bg][0:v]overlay=(W-w)/2:(H-h)/2,crop=h=iw*9/16" \
 $2
```

## Server must support the Range header

I ended up creating this issue for Hexo https://github.com/hexojs/hexo/issues/4829 to support range headers.

It was easy to figure out what's going on by using wireshark to see the embedded server was disregarding Apple's strict expectation of adherence to Range headers.

Here we see Hexo's development server disregarding the range headers:

{% asset_img wireshark-bad.png %}

When using the `http-server` module we can see the range header is respected:

{% asset_img wireshark-good.png %}

