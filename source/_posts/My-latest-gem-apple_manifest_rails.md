---
date: '2013-05-08'
title: created ruby gem apple_manifest_rails
tags: 
- ruby
---
<p>A couple days ago I released <a href="http://rubygems.org/gems/apple_manifest_rails">apple_manifest_rails</a>, a rails engine that simplifies the iOS application ad-hoc enroll / install process.</p>

<p>Usually you&#8217;d use a service like <a href="https://testflightapp.com/">Testflight</a> or <a href="http://hockeyapp.net/">Hockeyapp</a>. These are fine choices, but history has shown that these services are too complicated for my team and result in too many mistakes and missteps (especially with Testflight&#8217;s weird team/permission system). Why you need another layer of permissions when manual UDID provisioning forces permissions already is beyond me.</p>

<p>Rolling my own solution has ended up being easier for them, so I&#8217;ve packaged it up as a gem.</p>

<p><a href="https://github.com/kfatehi/apple_manifest_rails">Also available on Github</a></p>
