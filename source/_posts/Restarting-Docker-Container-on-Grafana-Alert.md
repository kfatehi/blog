---
title: Restarting Docker Container on Grafana Alert
date: 2020-12-22 13:09:05
tags:
- docker
- grafana
- automation
---

The other day, as I opened grafana to check how much electricity my heater was using, I noticed I had been missing data for hours.

{% asset_img missing-data.png after you setup grafana alerts you will get these nice markers %}

I attached to the logs of the container using Unraid's log view feature but nothing was obvious. No new output. It was just another Docker lockup. Keeping the code [very simple](https://github.com/kfatehi/smart-electric-panel-sce/blob/main/app/start.js) apparently was not enough to prevent random lockups.

{% asset_img unraid-docker-logs.png Unraid docker ui is a great example of simple yet effective design %}

I had two questions, followed by two actionable answers:

## 1. Does the container freeze often enough to warrant attention?

To answer this I needed to setup alerting. I used a private Discord server for this. Discord is wonderful -- one particular feature is the ease with which one can generate webhooks.

{% asset_img discord-webhook.png discord webhook convenience looking good, so easy it blurs the lines between programmer and non-programmer %}

I configured Grafana to alert on missing meter data. First I had to create an alert channel for discord, and then configure a panel with the appropriate query and alert conditions.

{% asset_img query.png any data %}

{% asset_img alert-conds.png interested in data gaps %}

I discovered that **yes, it happens frequently and randomly** ... once every couple of days to sometimes multiple times in one day.

## 2. Can I use the alert mechanism to perform the mundane act of restarting the container for me?

To answer this I imagined another container that accepts webhook to issue the appropriate `docker restart ...` command. **Yes it appears possible with Grafana's alert channel design decision**, so to whip up a nodejs & express:

```javascript
const app = require('express')();

app.post('/restart-studio-electricity-meter', function (req, res) {
    require('child_process').execSync("docker restart studio-electricity-meter"); 
    res.send('ok');
});

app.listen(1337, () =>{
    console.log('listening on 1337')
});
```

And create the appropriate channel on the Grafana side...

{% asset_img not-on-end.png dont shoot the webhook again when service is back up %}

This works great and I no longer lose data as my container is automatically restarted, and I am notified in Discord too.

{% asset_img 
destinos.png
multiple alert locations
%}

Grafana alerting seems to be so good that I can probably play with the timings in order not to be alerted at all, if it should start to annoy me. But at this point I need to remain aware and so I could not be happier with the current situation!

## A few more thoughts on Docker, perfectionism, amelioration of disdain for bandaid solutions, and getting over mental paralysis

Now, if you're like me (a bit of a perfectionist) you may be wondering why I am so jovial about a band-aid solution. The answer is I've used docker a lot (over 5 years now) and for all you docker honeymooners out there, know that frozen containers [continue to be a problem with little understanding by the Docker team](https://github.com/docker/for-win/issues/3892). That's just one example of a stale ticket. When I was dealing with this for a Rails client just a couple of months ago, I found many other examples of stale tickets. The best reference I had found from the [Gusto blog](https://engineering.gusto.com/how-to-run-docker-and-get-more-sleep-than-i-did/).

It's a bad situation that few seem to discuss, but I'm pretty sure everyone seriously using Docker knows it exists and actively avoids it by being hygenic about their Docker deployments. The Gusto story (in short, they had "too much output" on STDOUT for Docker. Yes, really, that was "the problem" -- is your faith in Docker shaken yet?) for my electricity meter it makes no sense (it only prints once every ~1200 milliseconds) and just further reduces Docker's credit in my eyes (I still love it though).

I assumed that the issue is within Docker itself: out of my hands. The [nodejs code](https://github.com/kfatehi/smart-electric-panel-sce/blob/main/app/start.js) inside the container which is powering the electricity meter middleware could not possibly be simpler or more straightforward. All it does is grab info from the USB Serial device **(maybe Docker has a problem holding onto the device, the --device flag could be a less supported code path with contention issues from the OS)**, do a bit of arithmetic, and then invoke curl to send the data to an endpoint.

Yes, all that said, it remains true that this is still a band-aid. It is important to remain aware that **sometimes band-aids are OK** and that being staunch perfectionist especially in the world of hacking (the [MIT definition](https://handbook.mit.edu/hacking#:~:text=Hacking%20is%20a%20long%2Dstanding,that%20demonstrate%20ingenuity%20and%20cleverness.), by the way) and security (there's your mass-media definition for hacking, if you must), **being overly perfectionist is an effective way to paralyze the self**. I'm not interested in that kind of thinking. It does not serve anyone. It's worth discussing why paralysis occurs, however. I believe it results from **knowledge of limited resources** versus the **suspicion that the goal is positioned far beyond their point of depletion**. I still struggle with this "fact" but taking it easy and just keep hacking has been effective advice from friends. I put "fact" in quotations because you can very easily argue that **both the amount of resources available to you and the effort (or path) required to achieve a goal are fluid. Therefore a conclusion towards inaction is fundamentally invalid.**

As I considered the data flow I further appreciated the elgance of the band-aid solution and grew to appreciate it and things like it. If I think of a chatroom as a message bus where machines (and humans) talk to each other then it is not unreasonable to think that machine A might inform machine B that machine C is misbehaving and needs a kick in the ass. In the case of my band-aid, however, it's simpler than that, as grafana's beautiful design for alert configuration lends itself to directly informing the ass-kicker of the story (source code link below). In other words I did not need to write code to catch outputs from Discord and parse them and take action on them. All I had to do was create an "alert channel" that hit my custom web service, disable the "alert has ended" messaging (so it only hits the webhook once, when the alert starts, not again once the alert is over) and add that alongside my Discord alerts.

The result is that I get to see this nice "bot conversation" in discord, letting me know that, sure, things are breaking down, but they are also getting fixed promptly, and sometimes that's the best we can do in an imperfect world and that's okay.

{% asset_img bottalk.png bot chit chat %}

# Resources

Source code [repository on GitHub](https://github.com/kfatehi/webhook-docker-rebooter) for the rebooter