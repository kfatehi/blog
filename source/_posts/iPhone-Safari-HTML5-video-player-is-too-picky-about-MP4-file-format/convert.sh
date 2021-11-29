#!/bin/bash
set -x
ffmpeg -an -i $1 -c:v libx264 -profile:v baseline -level 3.0 -c:a aac -movflags +faststart \
-filter_complex "[0:v]scale=ih*16/9:-1,boxblur=luma_radius=min(h\\,w)/20:luma_power=1:chroma_radius=min(cw\\,ch)/20:chroma_power=1[bg];[bg][0:v]overlay=(W-w)/2:(H-h)/2,crop=h=iw*9/16" \
 $2



# C:\workspace\blog> ffmpeg -h 2>&1 | grep '\-an' 
# -an                 disable audio



# bash source\_posts\iPhone-Safari-HTML5-video-player-is-too-picky-about-MP4-file-format\convert.sh source\_posts\Comma-3-development-workflow-for-transparent-display-by-means-of-scene-reprojection\seethru-112521.mp4.bak.mp4 source\_posts\Comma-3-development-workflow-for-transparent-display-by-means-of-scene-reprojection\seethru-112521.mp4

# https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/CreatingVideoforSafarioniPhone/CreatingVideoforSafarioniPhone.html