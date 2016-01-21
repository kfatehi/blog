---
date: '2011-06-12'
title: Using spark on your hackintosh for volume key binding a VoodooHDA PrefPane applescript
tags:
- hackintosh
---
<p>I had 2 more issues with my hackintosh.</p>
<p>1) I want the standard volume control buttons on my laptop to control the volume like a normal macbook.</p>
<p>2) I want to be able to open up VoodooHDA pref pane so I can adjust mixer settings. This will be the function key right next to the volume controls.</p>
<p>How to do awesome keybinding has been something I&#8217;ve been looking for a long time, and I found it: An awesome open source key bind program called <a href="http://www.shadowlab.org/Software/spark.php">Spark</a>. It does exactly what you&#8217;d expect and much, much more.</p>
<p>With spark, problem 1 is quickly solved.</p>
<p>Problem 2 requires binding the key to an applescript to pop open the pref pane, which I&#8217;ve pasted below:</p>
<pre>tell application "System Preferences"
	activate
	set current pane to pane "org.voodoo.VoodooHDA"
end tell
</pre>
<p>And problem 2 is solved now as well. Hell yeah!</p>
