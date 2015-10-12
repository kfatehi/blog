---
layout: page
title: "Welcome"
tagline: "welcome"
---
{% include JB/setup %}

<p>I'm a technologist living in Southern California.</p>

<p>Sometimes I'm compelled to write blog posts; they are published here.</p>

<p>
  You can learn more about me on
  <a href="https://github.com/keyvanfatehi">github</a>
  and <a href="https://www.linkedin.com/in/keyvanfatehi">linkedin</a>
</p>

{% assign post = site.posts.first %}

---
<center>
  <b>The newest post is beneath and was created on {{ post.date | date_to_long_string}}</b>
</center>
---

<div class="blog-index">  
  {% assign content = post.content %}
  {% include post_detail.html %}
</div>
