---
date: '2013-05-14'
title: Bellow ruby gem wraps Prowl and Notify My Android
tags:
- gems
- ruby
---

It wraps the top Prowl and Notify My Android ruby gems into one method

[bellow on github](https://github.com/kfatehi/bellow)

```ruby
# People and API keys for each service (nma and prowl)
people = {
  :guillaume => {
    :prowl => "f7a1879f0331667e0a993b501127a5f21ce7fbff",
    :nma => "baa2ab11aa424a08945938a3df1e0341ce935d30704eca0b"
  },
  'keyvan fatehi' => {
    :prowl => "757e5b121f243d7309eafa041ba93f5d794336cd"
  },
  :steve => {
    :prowl => "85138c449bd3ee2f48039c8ca471f710c4257f70"
  }
}

# Build your message
subject = "McDonalds"
message = "Hey guys I just ordered a Big Mac LOL"

# Notify them all with Bellow
Bellow.notify(people, app, message)
```

[ProwlApp](http://www.prowlapp.com)

[NMA](http://www.notifymyandroid.com)
