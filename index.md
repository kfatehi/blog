---
layout: page
title: "JBOD"
tagline: "Just a Bunch of Documents"
---
{% include JB/setup %}

Hi I'm Keyvan

I'm a software developer working with [motion picture experts](http://digitalfilmtree.com), living in Los Angeles.
I appear to be writing ruby and coffeescript the most, with objective-c close in third.

When in doubt, you'll probably know firstly if I'm still alive by checking my [github](https://github.com/keyvanfatehi)

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
</script>

<a id="toggle" href="#" onclick="toggle_more(this)">contact</a>
<pre id="more" style="display:none">
</pre>

---

The purpose of this blog site is threefold:
* Squat the keyvanfatehi.com domain with Github's help
* Publish solutions, techniques, etc
* Publish non-technical, social mojumbo

---

For more of a .NET twist, try [http://www.netaddict.co.za/](http://www.netaddict.co.za/)