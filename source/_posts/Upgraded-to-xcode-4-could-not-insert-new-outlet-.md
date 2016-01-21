---
date: '2011-06-07'
title: 'Upgraded to xcode 4 could not insert new outlet '
tags:
- xcode
---
<p>Are you following along on Apple&#8217;s &#8220;Your First iOS Application&#8221; guide, found <a title="iOS Developer Library: Your First iOS Application" target="_blank" href="http://developer.apple.com/library/ios/#documentation/iPhone/Conceptual/iPhone101/Articles/05_ConfiguringView.html">here</a>&#160;?</p>
<p>Did you upgrade to Xcode 4 mid way? Now when you try to create an outlet, and it says it &#8220;could not insert new outlet&#8221; in scary red letters; something about not know what class you are looking for.</p>
<p>But&#8230; my application builds! What the hell?</p>
<p>Confusing, yes, but this worked for me:</p>
<p>1) Go to your helloWorldAppDelegate.m file</p>
<p>2) You&#8217;ll see this code:</p>
<blockquote>
<p>@synthesize myViewController;</p>
</blockquote>
<p>or you might see</p>

```obj-c
@synthesize myViewController=_myViewController;
```

<p>3) If it is like the first example, change it to look like the 2nd one. If it is like the 2nd one, change it to look like the first.</p>
<p>4) Make sure the memory release is correct in your dealloc method at the bottom of the same file. If you changed the @synthesize to look like the 2nd example, make sure the release looks as such:</p>

```obj-c
[_myViewController release];
```

<p>And vice versa.</p>
<p>5) Build, simulate. If it works, try making the connection again from your nib file to your header file. At this point it worked for me.</p>
<p>Oddly enough, once it worked, I was able to reverse the changes in the helloWordAppDelegate.m file without any problems. Clearly this was just a bug in transitioning from Xcode 3 to Xcode 4.</p>
<p>Keep in mind that the two different ways of synthesizing that class variable is simply a matter of stylistic concern. In the earlier pages of the guide, it is explained that the underscore in `_myViewController` is to &#8220;remind you that you&#8217;re not supposed to access class variables directly &#8220;</p>
