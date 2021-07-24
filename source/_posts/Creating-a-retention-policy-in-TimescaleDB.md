---
title: Creating a retention policy in TimescaleDB after the fact and realizing it's not even a hypertable
date: 2021-07-14 15:22:28
tags:
- postgresql
- timescaledb
---

Are you looking for the official how-to guide from timescaledb about retention policies? [Here is a link](https://docs.timescale.com/timescaledb/latest/how-to-guides/data-retention/)

Firstly I want to know which tables I have are actually hypertables. You can [list hypertables](https://github.com/timescale/timescaledb/issues/648) (check that link as they talk about it having changed) by doing:

```sql
select * from _timescaledb_catalog.hypertable;
```

```
metrics=> select table_name from _timescaledb_catalog.hypertable;
   table_name   
----------------
 rails_requests 
 websockets     
(2 rows)
```

But I have a lot of other tables that are created by telegraf (specifically, [phemmer's fork](https://github.com/phemmer/telegraf/tree/postgres) which adds postgres output support). Why aren't they hypertables?

This is important because you can't do retention policies on regular tables with timescaledb. You also lose out on other important timescaledb features which in my case of concern about disk space may be important, i.e. compression.

Turns out that the telegraf plugin is not automatically creating a hypertable, so that's [a todo on my telegraf fork](https://github.com/kfatehi/telegraf/issues/1).

Regardless, we want to solve for disk space to avoid a 3 AM pagerduty alert. We want a retention policy of 12 months for the rails requests and 2 weeks for everything else.

Let's apply these now:

Here're [the docs](https://docs.timescale.com/timescaledb/latest/how-to-guides/data-retention/create-a-retention-policy/#creating-automatic-data-retention-policies) on creating a retention policy:

```sql
SELECT add_retention_policy('rails_requests', INTERVAL '12 months');
SELECT add_retention_policy('websockets', INTERVAL '2 weeks');
```

Let's apply these two policies now:

```
metrics=> SELECT add_retention_policy('rails_requests', INTERVAL '12 months');
 add_retention_policy
----------------------
                 1000
(1 row)

metrics=> SELECT add_retention_policy('websockets', INTERVAL '2 weeks');
 add_retention_policy
----------------------
                 1001
(1 row)

```

We can confirm it with

```sql
SELECT * FROM timescaledb_information.job_stats;
```

```
metrics=> SELECT * FROM timescaledb_information.job_stats;
 hypertable_schema | hypertable_name | job_id |      last_run_started_at      |    last_successful_finish     | last_run_status | job_status | last_run_duration |          next_start           | total_runs | total_successes | total_failures
-------------------+-----------------+--------+-------------------------------+-------------------------------+-----------------+------------+-------------------+-------------------------------+------------+-----------------+----------------
 public            | rails_requests  |   1000 | 2021-07-14 23:29:43.151347+00 | 2021-07-14 23:29:43.172576+00 | Success         | Scheduled  | 00:00:00.021229   | 2021-07-15 23:29:43.172576+00 |          1 |               1 |              0
 public            | websockets      |   1001 | 2021-07-14 23:53:44.497031+00 | 2021-07-14 23:53:44.533295+00 | Success         | Scheduled  | 00:00:00.036264   | 2021-07-15 23:53:44.533295+00 |          1 |               1 |              0
                   |                 |      1 | 2021-07-14 08:37:19.855855+00 | 2021-07-14 08:37:20.386981+00 | Success         | Scheduled  | 00:00:00.531126   | 2021-07-15 08:37:20.386981+00 |         70 |              69 |              1
(3 rows)
```

Looks good. But we need to free disk space NOW and we have many tables that are not hypertables...

What we can do is create hypertables [through migration](https://docs.timescale.com/timescaledb/latest/how-to-guides/hypertables/create/#:~:text=to%20set%20the-,migrate_data,-argument%20to) which will lockup tables for an unknown amount of time, or we can drop the table and rebuild it.

I am going to opt for scripting for the latter option because it's not a big deal to get a fresh start on these other tables. List them with `\d+`:
 
```
cpu
disk
diskio
elasticsearch_breakers
elasticsearch_fs
elasticsearch_http
elasticsearch_indices
elasticsearch_indices_stats_primaries
elasticsearch_indices_stats_shards
elasticsearch_indices_stats_shards_total
elasticsearch_indices_stats_total
elasticsearch_jvm
elasticsearch_os
elasticsearch_process
elasticsearch_thread_pool
elasticsearch_transport
ipvs_real_server
ipvs_virtual_server
mem
net
passenger
passenger_group
passenger_process
passenger_supergroup
postgresql
processes
procstat
procstat_lookup
rails_requests
swap
system
websockets
```

Eliminating the two tables that we already dealt with, the plan is to take these tables, and for each one, truncate the table, create the hypertable, and then set a 2 week retention policy... Let's do it manually with the biggest (and least interesting) table we have, the cpu table:

```
TRUNCATE TABLE cpu;
SELECT create_hypertable('cpu', 'time');
SELECT add_retention_policy('cpu', INTERVAL '2 weeks');
```

Wow indeed we saved 20GB... and thanks to the retention policy we will no longer run out of space.