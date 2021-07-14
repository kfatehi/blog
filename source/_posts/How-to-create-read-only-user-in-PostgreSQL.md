---
title: How to create a read-only user in PostgreSQL
date: 2021-07-14 10:24:42
tags:
- postgresql
---

I needed to do this in order to make a readonly user to consume TimescaleDB from Grafana. In Grafana users can write arbitrary SQL directly to the DB so for safety reasons a readonly user makes sense.

I realized that adding a read-only user forced a bit more understanding than what's necessary to use PostgreSQL from an application or conduct performance analysis, the typical developer tasks, so I would not be surprised if many devs, like me, haven't bothered, so I really recommend doing it.



Rather than post my own notes, I prefer the comments on this gist from Tomek, which I will archive the main gist here now and link to the GitHub hosted gist down below which is worth a look for the excellent follow-up discussions.

```sql
-- Create a group
CREATE ROLE readaccess;

-- Grant access to existing tables
GRANT USAGE ON SCHEMA public TO readaccess;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readaccess;

-- Grant access to future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readaccess;

-- Create a final user with password
CREATE USER tomek WITH PASSWORD 'secret';
GRANT readaccess TO tomek;
```

[Link to the original gist and discussion](https://gist.github.com/oinopion/4a207726edba8b99fd0be31cb28124d0)

By understanding this I was able to upgrade my mental model about PostgreSQL to the following: the world must be composed of users and groups called roles which have certain privilege to databases, schemas, and tables (also known as relations). Databases contain schemas and schemas contain tables.

I was relatively ignorant about the role of schemas before, but here we can see it is the mechanism by which future table privileges can be indicated. Do you know other reasons for which it may be valuable to know about schemas and their nuances?

This is part of a series about PostgreSQL & TimescaleDB -- in the next one I will show how to deal with a TimescaleDB/PostgreSQL instance that is running out of disk space. We'll do this by adding retention policies to certain relations after doing a bit of analysis.
