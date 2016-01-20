---
date: '2012-08-13'
title: Vendoringunpackingfreezing gems in ruby not rails no bundler
tags: 
---
<p>I&#8217;ve been writing a lot of utility scripts lately using <a href="http://mstratman.github.com/cocoadialog/">CocoaDialog</a> and its <a href="https://github.com/mikedamage/ruby-cocoa-dialog">ruby wrapper</a> to produce nice dialogs and <a href="http://sveinbjorn.org/platypus">Platypus</a> to package them as simple Mac droplets.</p>

<p>Since the users of the droplets will not have any gems installed, they need to be unpacked and added to your project:</p>

<p><code>gem unpack NAME</code></p>

<p>Be sure to do this for all dependencies of the given gem(s). Bundler helps quite a bit in figuring out what those are (e.g. <code>bundle package</code>), however <code>bundle package</code> provides you the <code>.gem</code> files and not the actual ruby scripts, so I use <code>gem unpack</code></p>

<p>Next, put the unpacked gems within your project, e.g. <code>vendor/gems</code> and add this to your script:</p>

<p><code>Dir.glob(File.join(File.dirname(__FILE__), "vendor", "gems", "*", "lib")).each do |lib|
  $LOAD_PATH.unshift File.expand_path(lib)
end
require 'GEMNAME' # they are in your load path now!</code></p>

<p>I do NOT require rubygems in these scripts, however if you will be doing this, or you suspect a gem might be doing this, you&#8217;ll want to prepare in advance, with a slight mod to the above:</p>

<p><code>require 'rubygems'
Dir.glob(File.join(File.dirname(__FILE__), "vendor", "gems", "*", "lib")).each do |lib|
  $LOAD_PATH.unshift File.expand_path(lib)
  Gem.path.unshift File.expand_path(lib)
end
require 'GEMNAME' # they are in your load path now! They'll also be known to rubygems within the context of your application</code></p>
