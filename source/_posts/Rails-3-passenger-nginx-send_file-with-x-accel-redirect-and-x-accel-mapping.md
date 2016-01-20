---
date: '2012-12-11'
title: Rails 3 passenger nginx send_file with x accel redirect and x accel mapping
tags: 
---
<p>After a lot of searching as to why range headers were not working despite thinking that I had X-Accel-Redirect configured properly, I realized that I was missing something in my nginx config and so send_file was still sending via rails rather than nginx, causing range headers to fail.</p>

<p>In order to fix this, I had to add a bit more to my nginx config:</p>

<pre>
    server {
      listen 80;
      server_name example.com;
      root /home/keyvan/example_app/public;
      passenger_enabled on;
      passenger_set_cgi_param HTTP_X_ACCEL_MAPPING /=/sec/;
      passenger_pass_header X-Accel-Redirect;

      location /sec/ {
        alias /;
        internal;
      }
    }
</pre>

<p>Now it works!</p>

<hr><p><a href="http://stackoverflow.com/questions/6237016/message-x-accel-mapping-header-missing-in-nginx-error-log">http://stackoverflow.com/questions/6237016/message-x-accel-mapping-header-missing-in-nginx-error-log</a>
<a href="http://airbladesoftware.com/notes/rails-nginx-x-accel-mapping">http://airbladesoftware.com/notes/rails-nginx-x-accel-mapping</a></p>
