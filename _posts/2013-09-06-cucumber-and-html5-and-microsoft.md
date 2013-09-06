---
layout: post
category : blog
tags : [mobile microsoft cucumber bdd]
---
{% include JB/setup %}

At work we have built a product that is comprised of 3 parts: a backend
written in Ruby on Rails, a web interface that is served by rails and
uses the rails controllers as usual, and an iOS app that interacts with
the Grape API mounted to the Rails app.

For the purpose of this article, a "feature file" describes a feature,
written in Gherkin, the start point for behavior driven development 
using cucumber.

The rails application, or rather the interactions from the served HTML,
have feature files. This makes me feel good because if I would
transition to an HTML5 app, separated from the rails controllers, that
uses the Grape API just as the iOS app does, the feature file can be
taken and placed into a new project (say, one generated with Brunch),
and cucumber.js can be used to behavior-drive the remaning functionality
with javascript or coffeescript.

What does this have to do with microsoft? Well it seems like folks are
doubtful that microsoft will be able to contend on the mobile
marketplace against the Apple and Google platforms. The most common
argument I have heard is that "windows phone doesn't have apps" but if
you think about it, neither did iOS or Android at one time.

Building iOS and Android apps is harder than building an
HTML5/Javascript app for many reasons. Developers are impeded on two
major, fundamental fronts: 
* Learning curve (brand new language, low level)
* Platform/SDK/Tools (must be on Mac for iOS, must learn Xcode, must
  learn android tools)

As technologies like Apache Cordova improve alongside HTML5/CSS3, and
the javascript ecosystem becomes richer, prototyping on the web is the
obvious choice.

So back to the project at my work...

The iOS application had no feature files at all -- it was terrifying for
a test-driven developer like me to have to maintain that and manage its
developers... they were like cowboys and you never knew if they would
ship with regression. Thanks to our iOS tester we catch most bugs quickly,
but the risks are unnecessary.

Luckily we found Calabash which is based on cucumber and uses the same
format for feature files. Some overlap with the web application and work
differently, and thus have different steps, but the same feature.
However the point is that now these feature files can be extracted and
placed into a new application.

This new application can be purely HTML5/CSS/Javascript and ship to
Windows, Mac, iOS, Android, the platform is not relevant as long as the
app is written in a responsive manner and has the appropriate bindings
to the OS, provided by PhoneGap, Microsoft, Qt, or whatever hackery
you're doing to deploy your HTML5 app to the target platform.

In the future this hackery will reduce, and hardware will be exposed
directly (e.g. getUserMedia()) in a device-compatible way, and Microsoft
is just as relevant as any other. Microsoft will have all the same apps
when it costs very little to get onto the platform in the first place
-- and for us, it does not cost much to get on Windows and Windows
Phone. I imagine other development shops see this too and will also
target the Microsoft platform offerings. 
