---
date: '2013-05-11'
title: Hello jekyll goodbye tumblr
tags:
- ruby
---

Migrating my posts from Tumblr and into Jekyll was not too difficult but I did need to write a little script to make this work.

[Gist](https://gist.github.com/kfatehi/5562147)

```ruby
#!/usr/bin/env ruby

require 'rubygems'

##
# Monkeypatch to fix the following
# tumblr.rb:73
#   content = post.at["audio-player"] + "<br/>" + post["audio-caption"]
class Hash
  def at
    self
  end
end

begin
  require 'jekyll/jekyll-import/tumblr'
rescue
  puts "Missing jekyll-import gem. Do this: gem install jekyll-import --pre"
  exit -1
end

JekyllImport::Tumblr.process("http://slog.keyvanfatehi.com", true)
```
