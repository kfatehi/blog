---
date: '2011-06-08'
title: How to change an interface button title from within ios code
tags:
- ios
- xcode
---
<p>1) Open your Nib file (.xib) for your view controller.</p>
<p>2) Click on the button that you want to be able to change the label for, and from the Utilities panel (Appears on the far right when you enable it in Xcode view) and go to the connections section.</p>
<p>3) You probably already have a connection (Touch Up Inside or something else) to some method in your File&#8217;s Owner (Your controller class). In order to be able to access the attributes of the button itself from within the class, <strong>we need to make a new Referencing Outlet to this button</strong>.</p>
<p>To create a new referencing outlet for this button, click inside the circle for &#8220;New Referencing Outlet&#8221; and drag (connect) to your controller&#8217;s header file. Give it a name, like myButton.</p>
<p>Congratulations! You can now access and potentially modify the attributes of your button from within your iOS program.</p>
<p>4) You can now make use of the following source code, to change the button title (when an action is hit, for example):</p>
<p>[myButton setTitle:@&#8221;New Label&#8221; forState:UIControlStateNormal];</p>
<p>There are other UIControl states that you can use, but this was sufficient for me.</p>
