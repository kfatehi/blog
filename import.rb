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