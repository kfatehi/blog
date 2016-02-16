---
title: How to insert fake calls into the iPhone call log history
date: 2016-02-16 13:47:27
tags:
- iphone
---

The iPhone Wiki [has an article about the call history database](https://www.theiphonewiki.com/wiki/Call_History_Database), which is outdated at the time of this writing, but does indicate that it's a SQLite database. My iPhone had this file, which I could open and read rows from with the given schema, but there were no rows!

After some more digging, I found [this post in /r/jailbreakdevelopers](https://www.reddit.com/r/jailbreakdevelopers/comments/3m1mw7/working_on_the_call_history_ios_8/) which reveals that the location and schema of the SQLite database has changed as of iOS 8.3.

My device is the last version of iOS 8 (I am a jailbreak hold-out and missed the window for the iOS 9 update + JB).

Armed with the true location, I could continue to analyze and hopefully modify the database file correctly.

First thing I did was get openssh server running on my iPhone (available through Cydia).

Then I created a directory and downloaded the database directory.

```sh
scp -r root@172.20.10.2:/var/mobile/Library/CallHistoryDB .
```

Because I know I will make a lot of mistakes, I initialized a git repo and checked the files in. This way I could use git to `reset` my get the original, untainted database back at any time.

Next I created this Makefile so I could rapidly iterate, sending the modified database to my phone.

```makefile
all: reset modify push

reset:
        git checkout CallHistoryDB/*

push:
        scp CallHistoryDB/CallHistory.* root@172.20.10.2:/var/mobile/Library/CallHistoryDB/

modify:
        ruby insert.rb
```

Next I examined the database with a text editor to determine the schema... I extracted it out to a text file:

```sql
CREATE TABLE ZCALLRECORD (
  Z_PK INTEGER PRIMARY KEY,
  Z_ENT INTEGER,
  Z_OPT INTEGER,
  ZANSWERED INTEGER,
  ZCALLTYPE INTEGER,
  ZDISCONNECTED_CAUSE INTEGER,
  ZFACE_TIME_DATA INTEGER,
  ZNUMBER_AVAILABILITY INTEGER,
  ZORIGINATED INTEGER,
  ZREAD INTEGER,
  ZDATE TIMESTAMP,
  ZDURATION FLOAT,
  ZADDRESS VARCHAR,
  ZDEVICE_ID VARCHAR,
  ZISO_COUNTRY_CODE VARCHAR,
  ZNAME VARCHAR,
  ZUNIQUE_ID VARCHAR
)
```

Next I created my ruby script. Basically I open the database, print the rows, insert a row, then print the rows again.

```ruby
require "sqlite3"

db = SQLite3::Database.new "CallHistoryDB/CallHistory.storedata"

db.execute("select * from zcallrecord") do |row|
  p row
end

db.execute(%{
INSERT INTO zcallrecord (
  Z_ENT,
  Z_OPT,
  ZANSWERED,
  ZCALLTYPE,
  ZDISCONNECTED_CAUSE,
  ZFACE_TIME_DATA,
  ZNUMBER_AVAILABILITY,
  ZORIGINATED,
  ZREAD,
  ZDATE,
  ZDURATION,
  ZADDRESS,
  ZDEVICE_ID,
  ZISO_COUNTRY_CODE,
  ZNAME,
  ZUNIQUE_ID
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}, [
  2, 1, 1, 1, nil, nil, 0, 0, 1, 475200000, 60.0, "+17277531234", nil, "us", nil, "58918CBA-C9C1-479B-8B6D-9DD1FD70E293"
])

db.execute("select * from zcallrecord") do |row|
  p row
end
```

I then ran `make` until I had all my inputs correct and the call log was modified appropriately. Be sure to close the "Phone App" each time, so that it reads from the database file again.
