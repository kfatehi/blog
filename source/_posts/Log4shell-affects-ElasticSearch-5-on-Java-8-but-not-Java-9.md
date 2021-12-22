---
title: Log4shell affects ElasticSearch 5 on Java 8 but not on Java 9
date: 2021-12-21 23:08:54
tags:
- hackers
---

## Ranty Prelude

I need to see "your truth" with my own eyes before I cargo-cult your imposed commandments to perform some upgrades. If I'm vulnerable, prove it, else how will I know I solved the problem? Just keep taking your word for it, yeah?

This experience had synchrony with the disputations relating to COVID-19, specifically how we cargo-cult the vaccinations without proof of vulnerability nor proof of patching of said vulnerability. I don't talk about politics on this site but damn this was such funny parallel it's impossible not to point it out.

Some of us just need evidence... we need to exploit or at least see proof of exploitability, before drastic action is warranted, for the drastic action could cause undesired side effects to a system that is otherwise working fine. This is scientific. Anything else is unscientific. I am so tired of appeal to authority or majority "consensus" being considered anything but <a href="https://www.developgoodhabits.com/appeal-to-authority/">fallacious. Sadly not everyone takes Logic.</a>

When I'm lost and my team can no longer help me, I turn to IRC. Here's my nice experience sharing this with #elasticsearch on <a href="https://libera.chat/">libera.chat</a> IRC and then helping myself through experimentation.

## Fishing Line to Finish Line

**keyvan:**
good afternoon. im looking for help reproducing the log4shell hack on my ES 5 instance. i have enabled slowlogger and can see my jdni-infected query in the logs, but it does not seem to call out to the external server. i have verified the external setup (im using log4shell.huntress.com) with a small example project containing only various log4j versions and it does work; but it seems elasticsearch isn't affected? but it should be? thanks

**wwalker:**
keyvan: does ES 5 run a new enough log4j to be affected?  ES5 seems like it probably ran log4j rather than log4j-2

**keyvan:**
wwalker: i think it uses log4j 2.9, i know 5.6.10 there's a PR that bumps it to 2.11. there is a table here that shows 5 is supposed to be vulnerable https://discuss.elastic.co/t/apache-log4j2-remote-code-execution-rce-vulnerability-cve-2021-44228-esa-2021-31/291476 but what is interesting is that it appears if on Java 9 (on ES6) you're not vulnerable? so i am wondering if i am not able to repro because im on Java9 on ES5... 

**keyvan:**
i will be downgrading to Java 8 to verify this (the "more vulnerable java") according to that table...

**keyvan:**
haHA!!!!!!!! yep, my ES5 with java 8 was vulnerable... but with Java 9 was NOT.. 

## Eating the Fish

Mainly we've got here a java8 container which is vulnerable to the JNDI attack: https://github.com/kfatehi/docker-elasticsearch5-java8

Go ahead and try swapping it for the java9 (here you go: https://keyvan.cloud/files/jre-9.0.1_linux-x64_bin.tar.gz ) and see for yourself.
