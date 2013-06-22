---
layout: page
title: "JBOD"
tagline: "Just a Bunch of Documents"
---
{% include JB/setup %}
{% include cleverbot.html %}

<script>
// I'm being silly :3
info = "p"+"h"+"o"+"n"+"e"+":"+" "+"["+"1"+"]"+"-"+"["+"7"+"2"+"7"+"]"+"-"+"["+"7"+"5"+"3"+"]"+"-"+"["+"9"+"8"+"2"+"6"+"]";
info += "\n"+"e"+"m"+"a"+"i"+"l"+":"+" "+"k"+"e"+"y"+"v"+"a"+"n"+"f"+"a"+"t"+"e"+"h"+"i"+"@"+"g"+"m"+"a"+"i"+"l"+"."+"c"+"o"+"m";
info += "\n"+"s"+"k"+"y"+"p"+"e"+":"+" "+"k"+"e"+"y"+"v"+"a"+"n"+"."+"f"+"a"+"t"+"e"+"h"+"i";
info += "\n"+"i"+"r"+"c"+"/"+"/"+"f"+"r"+"e"+"e"+"n"+"o"+"d"+"e"+":"+" "+"l"+"o"+"v"+"c"+"l"+"r"+"t"+"x"+"t";
info += "\n"+"t"+"w"+"i"+"t"+"t"+"e"+"r"+":"+" "+"@"+"l"+"o"+"v"+"c"+"l"+"r"+"t"+"x"+"t";
info += "\n"+"f"+"a"+"c"+"e"+"b"+"o"+"o"+"k"+":"+" "+"N"+"/"+"A";
info = btoa(info);

function toggle_more(el) {
  more = document.getElementById('more');
  if (el.innerHTML=='contact') {
    more.style.display = 'block';
    more.innerHTML = info;
    el.innerHTML = 'decode';
  }
  else {
    more.innerHTML = atob(info);
    el.style.display = 'none';
  }
}

function poke() {
  document.getElementById('bio').style.display = 'block';
  setTimeout(function(){
    this.onclick = function(){
      alert('what?');
    }
  }, 500)
}
</script>


<a href="#" onclick="poke(this)">Keyvan</a>
<div id="bio" style="display:none">
  I'm a software developer working with <a href="http://digitalfilmtree.com">motion picture experts</a> and living in Los Angeles.
  I appear to be writing ruby and coffeescript the most, with objective-c close in third.

  When in doubt, you'll probably know firstly if I'm still alive by checking my <a href="https://github.com/keyvanfatehi">github</a>
  <a href="#" onclick="toggle_more(this)">contact</a>
  <pre id="more" style="display:none">
  </pre>
</div>
---

The purpose of this blog site is threefold:
* Squat the keyvanfatehi.com domain with Github's help
* Publish solutions, techniques, etc
* Publish non-technical, social mojumbo

---

For more of a .NET twist, try [http://www.netaddict.co.za/](http://www.netaddict.co.za/)

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
