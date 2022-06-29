---
title: In praise of observation
date: 2022-06-29 06:03:52
tags:
  - iot
  - telegraf
  - grafana
  - antitech
---

One of the things that kept me relevant enough to retain gainful employment well into my old age, lack of "hustle" for the "paper chase" and all around disillusionment with life and technology, stems from work I've done with small electronics for the purpose of capturing metrics about our reality ("IoT").

All around us, every moment, we miss out on potential to know the truth now and in the future. We have so much richness all around us that we think this is fine and normal, to capture even a fraction of it is hard to imagine. Our vision for example, can only capture a small fovea at some frequency that we reproduce in video in terms of frames per second... capture all of it and you don't get an emergent pattern, you get the product of a fully exposed aperture: pure washout due to overabundance of information causing clipping in the sensors.

Nevertheless, where it makes sense, we have the means to capture data and the ability to capture that which is otherwise left to oblivion (even photography falls under this, following my previous example, and it could be part of what makes instagram so appealing as compared to twitter, the trash heap of the internet) is like magic.

{% asset_img newhorizons.png "New Horizons" %}
_NASA's New Horizons might just be my favorite IoT device in the universe._

Enjoying the aesthetic and beauty of a photograph on your phone, or the immersion of a 6-DoF VR experience in a photogrammetrically captured environment, are great examples of creating future value through the capture of that which is otherwise ephemeral. There is beauty in automated feedback-loop control systems, or the manual work of a designer making important decisions based on observed patterns of data, using tools like linear regression to be prepared.

If IoT wasn't such a security problem, I'd probably never have quit, but I've written about how dwelling on security issues is paralyzing in a bad way. Especially for me, because I see connected sensors as an important substrate (or overlay) to my other real-world projects. Not all sensors exist or are affordable, of course, and so we make up for it with failure, collecting those experiences in our brains. Since IoT is inherently less secure than no IoT, when being ultra-conservative I tend to throw the baby out with the bathwater. A better idea is to raise the baby well, with good security posture in mind, and use the bathwater in the garden.

{% asset_img garden.png "A Garden" %}

My gainful employment over the past couple years (I think I started this full-time job around September 2021) relit the spark and has kept me sharpening the tools without really realizing it so consciously. Particularly, TimescaleDB, Grafana, and Telegraf, have become as obvious as the hammer, nail, and screwdriver. The pressures (amount of data, as well as the hammering of users of the grafana dashboards) have caused me to figure out all the details of Timescale that a small operation might not need to know about: creating the right indices, setting proper retention policies, managing jobs to move to alternative hard drives by means of postgres' tablespaces.

**I'm grateful about it because if there's any skill worth having (and that stays useful in industry), it's knowing how to gather metrics and I don't care if it's about some software system, hardware system, done with a computer, or done with your eyes, pen, paper and brain.**
