---
date: '2011-06-07'
title: How to add a framework to your project in xcode 4
tags:
- xcode
---
<p>When I googled for this, I got false information &#8212; so here is how you do it:</p>
<p>1) First click the Blue Xcode icon signifying your project on the lefthand navigation pane.</p>
<p>Confused? The highlighted thing: </p>
{% asset_img 1.png %}
<p>2) Now look right, to the next pane. Make sure the project name under TARGETS is selected, not PROJECTS.</p>
<p>Looks like this: </p>
{% asset_img 2.png %}
<p>3) Next pane on the right, you&#8217;ll see a few things at the top, &#8220;Summary&#8221;, &#8220;Info&#8221;, &#8220;Build Settings&#8221;, &#8220;Build Phases&#8221;, &#8220;Build Rules&#8221; &#8230; You want to click on <strong>Build Phases</strong>.</p>
<p>You will see a few expandable sections now.</p>
<p>4) Expand the section labeled <strong>Link Binary With Libraries</strong></p>
<p>You should now be seeing something that looks like this:</p>
{% asset_img 3.png %}
<p>5) Click the + button at the bottom-left of that <strong>Link Binary With Libraries </strong>section</p>
<p>Select the library you want, for example, AVFoundation.framework and click <strong>Add</strong>.</p>
<p>You&#8217;ll notice the library/framework has appeared in your navigation pane at the left.</p>
<p>You can go ahead and drag that into the Frameworks folder.</p>
<p>6) In order to utilize the framework, you will need to <em>#import</em> it into your source code.</p>
<p>For AVFoundation.framework, I simply put the following line in my main.m, right under the existing <em>#import</em> for UIKit</p>
<blockquote>
<p>#import &lt;AVFoundation/AVFoundation.h&gt;</p>
</blockquote>
<p>And that worked for me.</p>
