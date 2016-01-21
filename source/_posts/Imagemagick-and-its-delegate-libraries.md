---
date: '2011-07-18'
title: Imagemagick and its delegate libraries
tags: 
- ruby
---
<p>You need ImageMagick in order to get ruby gems such as Paperclip, or Rmagick, etc to work properly. ImageMagick is one of the most feared dependencies since even if you correctly install it, you may still get errors like:</p>
<pre>"is not recognized by the 'identify' command"</pre>
<p>This is because "identify", a command that comes in the ImageMagick suite (in addition to "convert"), requires special libraries to understand different image formats. These special libraries are called "delegates".</p>
<p>You can see all the delegates set up to work with your current ImageMagick with this command:</p>
<pre>convert -list configure</pre>
<p><span><span>All the delegates are available at this link:</span></span></p>
<p><span><span><a href="http://www.imagemagick.org/download/delegates/">http://www.imagemagick.org/download/delegates/</a></span></span></p>
<p><span><span>There are 2 that you need for jpeg: </span></span>Jasper and Jpeg</p>
<p>Grab any that you need, ./configure, make, sudo make install </p>
<p>Now you need to recompile ImageMagick and make sure it works with these delegate libraries:</p>
<pre>./configure --enable-delegate-build --enable-shared --disable-static \
--with-modules --with-quantum-depth=16 --without-wmf \
--enable-libtool-verbose --disable-dependency-tracking \
--with-gs-font-dir=/usr/local/share/ghostscript/fonts/ --with-lqr
make
sudo make install
</pre>
<p>You should hopefully see your delegates--if not at least you know about them now and can troubleshoot further--enjoy.</p>
