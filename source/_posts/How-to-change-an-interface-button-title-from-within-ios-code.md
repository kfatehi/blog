---
date: '2011-06-08'
title: How to change an interface button title from within ios code
tags:
- ios
- xcode
---

1) Open your Nib file (.xib) for your view controller.

2) Click on the button that you want to be able to change the label for, and from the Utilities panel (Appears on the far right when you enable it in Xcode view) and go to the connections section.

3) You probably already have a connection (Touch Up Inside or something else) to some method in your File's Owner (Your controller class). In order to be able to access the attributes of the button itself from within the class, **we need to make a new Referencing Outlet to this button**.

To create a new referencing outlet for this button, click inside the circle for "New Referencing Outlet" and drag (connect) to your controller's header file. Give it a name, like myButton.

Congratulations! You can now access and potentially modify the attributes of your button from within your iOS program.

4) You can now make use of the following source code, to change the button title (when an action is hit, for example):

```obj-c
[myButton setTitle:"New Label" forState:UIControlStateNormal];
```

There are other `UIControl` states that you can use, but this was sufficient for me.
