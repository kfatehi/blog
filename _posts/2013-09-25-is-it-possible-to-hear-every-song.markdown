---
layout: post
title: "is it possible to hear every song?"
published: true
---

/google "more music than you can possibly consume in a lifetime"
About 5,420,000 results (0.43 seconds) 

/retry "is it possible to hear every song"
About 2,760,000,000 results (0.39 seconds) 

Is it possible to hear every song that has ever been ...
5 hours ago - e.g. How to make Sushi? • Where to buy the best ground coffee? • Which is the best phase of a relationship? Your New Answers Experience!

/clicky http://answers.yahoo.com/question/index?qid=20130924193110AA4yvRy

> Is it possible to hear every song that has ever been professionally recorded in one's life?
blue pixie asked 6 hrs ago - 4 days left to answer

Prism answered 6 hrs ago
> Lol no
 
el Águila answered 5 hrs ago
> Yes; if you listen to, like, 100 songs at once. 
> So, get 100 albums on 100 record players and play them all at once, replacing albums as necessary.
> * 1 person rated this as good

/answer

Not meaningfully, but why do you want to do this?

Well, perhaps with brain computer interfaces, and an API (e.g. http://developer.echonest.com/), you could perhaps achieve whatever your reason is...

Math-wise, you'd need to find out how many songs have been professionally recorded on the planet.
How many songs does Spotify have?

Number of songs: Over 20 million\*
Number of songs added per day: Over 20,000
Source: http://press.spotify.com/us/information/


Let's assume every song averages to about 5 minutes, for ease of calculation, and forget about the 20k added each day, we can factor that in later...
How long will it take to listen to all of it? If that reasonable, how long will it take to stay on top of the 20k added each day?

(20,000,000 * 5) / 60 = 1,666,666 total hours

How many days is that? If you can manage to listen for every waking hour

let 24 - 8 sleeping hours be a 16 hour day

1,666,666 / 16 = 104,166 total days

How many months is that? 
/wolframalpha 104,166 days to months

3425 months!

That's 285+ years.

So no.

As far as keeping up with new stock, assuming it stays at 20,000 added per day (hah):
{% highlight javascript %}
function days2listen(numSongs)
{
  var averageSongDuration = 5;
  totalHours = (numSongs * averageSongDuration) / 60
  wakingHoursPerDay = 24 - 8
  return totalHours / wakingHoursPerDay
}
{% endhighlight %}

<pre>
➜  ~ git:(mac) ✗ node
> function days2listen(numSongs)
... {
...   var averageSongDuration = 5;
...   totalHours = (numSongs * averageSongDuration) / 60
...   wakingHoursPerDay = 24 - 8
...   return totalHours / wakingHoursPerDay
... }
undefined
> days2listen(20000)
104.16666666666667
</pre>

/wolframalpha 105 days to months = 3.452 months

So yeah, if you ignore the pre-existing stuff, it seems doable to keep up with the new.


