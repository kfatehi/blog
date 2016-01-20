---
date: '2012-07-08'
title: Fixing gcc on mountain lion for gem install
tags: 
---
<p>When you install Mountain Lion, you will no longer have build tools such as `gcc` or `make`</p>
<p>Step 1, get the latest Xcode, and install Command Line Tools, granting you `make` and `gcc`</p>
<p>Step 2, create the symlink so that your bundler/gem commands will locate `gcc` correctly&#160;: `sudo ln -s /usr/bin/gcc /usr/bin/gcc-4.2`</p>
<p>Step 3, done! You don&#8217;t need MacPorts or a special version of `gcc`, the one installed by Xcode4.5 Developer Preview 2 is just fine and compiles native extensions for me successfully.</p>
