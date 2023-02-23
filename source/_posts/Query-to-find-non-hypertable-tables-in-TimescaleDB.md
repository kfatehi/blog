---
title: Query to find non-hypertable tables in TimescaleDB
excerpt: Here is an easy to use query to reveal the tables which are not taking advantage of the special features of TimescaleDB, specifically retention policies, automatic moving, and high performance chunking.
date: 2023-02-22 16:11:20
tags:
- postgresql
- timescaledb
- observability
---

Here is an easy to use query to reveal the tables which are not taking advantage of the special features of TimescaleDB, specifically retention policies, automatic moving, and high performance chunking.

In {% post_link Creating-a-retention-policy-in-TimescaleDB.md %} we discussed the fact that the Telegraf TimescaleDB Postgres output plugin does not properly create hypertables automatically. I wrote the following query to reveal them easily:

```SQL
SELECT
pg_size_pretty(pg_total_relation_size(pt.relid)),
pt.relname,
ht.hypertable_name
from pg_catalog.pg_statio_user_tables pt
LEFT JOIN
timescaledb_information.hypertables ht
ON
pt.relname = ht.hypertable_name
WHERE
pt.relname NOT LIKE '_hyper_%_chunk' -- Filter out the underlying hypertable chunks --
AND
ht.hypertable_name IS NULL -- Select those who are lacking a hypertable so we know what we need to create--
order by pg_total_relation_size(pt.relid) desc
limit 20;
```

At this point you can use the truncation method to quickly make them into hypertables, e.g.:

```SQL
BEGIN;
TRUNCATE TABLE mem;
SELECT create_hypertable('mem', 'time');
SELECT add_retention_policy('mem', INTERVAL '2 weeks');
COMMIT;
```
