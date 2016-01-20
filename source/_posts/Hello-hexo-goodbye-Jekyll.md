---
title: Hello hexo goodbye Jekyll
date: 2016-01-20 14:52:37
tags:
- ruby
---

Migrating my posts from Jekyll (which had old stuff from tumblr, never properly integrated) into Hexo without breaking Hexo's defaults.

[Gist](https://gist.github.com/kfatehi/236209b093c66da11065)

```ruby
require 'yaml'

def read_post(path)
  post = { front_matter: {}, content: nil }
  File.open(path) do |src|
    front_matter_lines = []
    content_lines = []
    scanning_front_matter = true
    parsing_front_matter = false
    src.readlines.each do |line|
      if scanning_front_matter and line.strip == "---"
        if parsing_front_matter
          parsing_front_matter = false
          scanning_front_matter = false
        else
          parsing_front_matter = true
        end
      else
        if parsing_front_matter
          front_matter_lines.push(line)
        else
          content_lines.push(line)
        end
      end
    end
    begin
      post[:front_matter] = YAML.load(front_matter_lines.join())
    rescue
      puts path
      puts front_matter_lines[0..5].inspect
      exit(0)
    end
    post[:content] = content_lines.join()
  end
  post
end

def write_post(path, post)
  File.open(path, "w") do |dest|
    dest.write YAML.dump(post[:front_matter])+"---\n"
    dest.write post[:content]
  end
  puts "Wrote #{path}"
end

def import_post(path, &block)
  cap = File.basename(path).match(/^(\d\d\d\d)-(\d\d)-(\d\d)-(.+)$/)
  title = File.basename(cap[4].gsub('-', ' ').capitalize, '.*')
  post = read_post(path)
  write_post("source/_posts/#{title.gsub(' ', '-')}.md", {
    content: block_given? ? block.call(post[:content]) : post[:content],
    front_matter: {
      "date" => cap[1..3].join('-'),
      "title" => title,
      "tags"=> post[:front_matter]["tags"]
    }
  })
end

Dir.glob([
  "../keyvanfatehi.github.com/_posts/tumblr/*.true",
  "../keyvanfatehi.github.com/_posts/*.md",
]).each do |path|
  import_post(path) do |body|
    body
      .gsub("{% include JB/setup %}\n","")
      .gsub(/{% highlight ruby %}/,"```ruby")
      .gsub(/{% endhighlight %}/,"```")
  end
end
```
