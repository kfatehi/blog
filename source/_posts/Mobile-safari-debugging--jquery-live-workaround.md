---
date: '2012-10-17'
title: Mobile safari debugging  jquery live workaround
tags: 
---
<h2>Mobile Safari Debugging</h2>

<p>In order to view the browser inspector for the Safari session on your iPad, go to Settings-&gt;Safari-&gt;Advanced and enable Web Inspector</p>

<p>Next, connect the iPad to your Mac and open Safari. Choose Develop from the menu bar and you will see the connected iPad and be able to open the console session.</p>

<h2>jQuery live()</h2>

<p>On Mobile Safari, $(element).live() appears not to work. The workaround is to add the attribute &#8216;onclick&#8217; to the element. Now it works.</p>
