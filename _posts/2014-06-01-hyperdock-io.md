---
layout: post
title: "Open Sourcing Hyperdock"
tags:
  - docker
  - hyperdock
  - open source
  - ruby on rails
published: true
---

I’ve thought about [Hyperdock](https://github.com/hyperdock-io) some more and have realized (eerily similarly to my Internet of Things project, [Netpocket](https://github.com/netpocket)) that although it can be a useful product, it is too broad and requires too much resources to do correctly.

I have taken steps in planning to minimize the scope (e.g. removing the concept of a `monitor`, and only having docker hosts — solving monitoring by utilizing Keen.io across the platform) however despite my efforts I can’t see this project doing anything except cannibalizing my time. I liked how Hyperdock started out -- in minimizing reliance on outside systems -- but as I saught to rapidly prototype, I started using more and more external services (DigitalOcean, Cloudflare), but monitoring remained an internal, automatically deployed Logstash / Sensu stack... Departing from this and into Keen.io is a good, correct move, but further solidifies the change from Hyperdock as a PaaS business to Hyperdock as Open Source Software. It's shaped up to be a rails version of the [Shipyard Project](http://shipyard-project.com/) and I think that is good.

It’s hard to justify the previous direction I was taking with it when solutions exist for the end result (e.g. you want ZNC? Check https://bnc.im or https://yourbnc.co.uk, so on for each application we might try to support)... When I first conceived of hyperdock I thought it is silly how companies are built around a single product (such as RedisToGo, or MongoLab) but my perspective on this has changed after several weekends of cramming in Hyperdock development: 

I now realize that although one can develop a platform that can run any of these programs, doing any of these programs correctly, in a value-added way, is a huge task requiring a lot of specialization, infrastructure, and systems intelligence. Hyperdock can still be useful for small projects and developers, but I can’t really see us charging for the value it offers, and if we were to charge and have customers, I don’t see it offsetting costs while still providing good quality of service. If you need professional-level Mongo, for example, you won't pay someone who runs a generic docker platform, you will pay someone who runs a professional-grade Mongo platform!

By being realistic about this, and refocusing away from my own greed or desire for a startup, it is clear what I need to do. I will prepare a simple splash page explaining Hyperdock as it is: a DigitalOcean and Docker powered container platform; I will open-source the project. I will kill all the currently running servers. I will add some nice documentation to the README and splash page and point http://hyperdock.io to that.

It is possible that Hyperdock will be embraced by the community, if so then good! If not, I still had fun building it and might use it again in the future.
