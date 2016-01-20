require 'yaml'

def import_post(relpath)
  path = File.absolute_path(relpath)
  filename = File.basename(relpath)
  cap = filename.match(/^(\d\d\d\d)-(\d\d)-(\d\d)-(.+).true$/)
  year = cap[1]
  date = cap[1..3].join('-')
  title = cap[4].gsub('-', ' ').capitalize
  front_matter = { "date" => date, "title" => title }
  content = nil
  File.open(path) do |src|
    front_matter_lines = []
    content_lines = []
    parsing_front_matter = nil
    src.readlines.each do |line|
      if line.strip == "---"
        if parsing_front_matter
          parsing_front_matter = false
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
    front_matter["tags"] = YAML.load(front_matter_lines.join())["tags"]
    content = content_lines.join()
  end
  File.open("../source/_posts/#{title.gsub(' ', '-')}.md", "w") do |dest|
    dest.write YAML.dump(front_matter)+"---\n"
    dest.write content
  end
end

Dir.glob("../../keyvanfatehi.github.com/_posts/tumblr/*.true").each do |relpath|
  import_post(relpath)
end
