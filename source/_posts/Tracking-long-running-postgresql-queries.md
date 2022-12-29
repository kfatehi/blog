---
title: Tracking long-running postgresql queries
date: 2022-12-27 15:14:56
tags:
- traceability
- postgresql
- rails
- ruby
excerpt: automatic logging of long running queries and the automatic injection of a tracer comment into every Rails ActiveRecord query
---

Last time we learned how to add comments to our SQL queries. This helps tie logged queries back to code. But to truly achieve this goal have to solve two more problems: the **exfiltration** of long running queries and the **injection** of a unique identifier that maps to our workloads' code paths:

1. **exfiltration** Postgres will not log a query for which the client unexpectedly disconnects. Even if a query runs for a very long time, it may not be logged at all. There may be other situations in which these important queries are lost to the ether, so we must detect and save them before this happens.

Let's use [the cron method described in this StackOverflow answer from dland](https://dba.stackexchange.com/questions/163894/log-plans-for-queries-that-never-finish/188546#188546) to solve for this. [dland](https://dba.stackexchange.com/users/123698/dland) write:

>To be honest, logging long-running queries seems via cron does seem like the most KISS solution to me:

> `psql -tc "select now() as t, pid, usename, query from pg_stat_activity where state != 'idle'" > /tmp/pg.running.txt`
>Then you can spot the queries that stay there for several hours and run EXPLAIN on them.

This means we will end up creating a separate log file so we should think about how to organize this information so that it's useful and not overwhelming. To this point, I think long running queries should instead be dumped into the default log file occasionally, so that operators can grep the same log file, except that now it will be more enriched.

We need to decide upon what frequency to invoke the check. I think 1 minute is fine, that's too long for a database query. If something is running for a long time it will get printed over and over, once every minute.

We do not want to see active queries that are faster than 1 minute, which happen to be active at the time of the check, so we'll make sure to only log queries whose runtime is exceeding 1 minute.

Finally I would like to avoid using an external program and do this all within postgres, this way we can use the existing logging functions and keep things self-contained.

2. **injection** How and what to inject into the queries for your app. When we learned {% post_link How-to-trace-postgresql-database-SQL-queries %} we did not determine how to do it from a conventional web application. Nor did we determine exactly what to inject.
  i. **How**: let's create a solution compatible with the default ActiveRecord postgres driver used in Ruby on Rails to automatically insert a SQL comment on every query. There is some precedent, e.g. [Rails 6 saw the addition of the `annotate` method](https://blog.saeloun.com/2020/01/29/rails-6-adds-activerecord-relation-annotate-for-adding-sql-comments-to-activerecord-relation-queries.html) which injects a SQL comment into a query. We are looking for an automated solution, however, since our app has a lot of queries and we do not wish to edit all (any) of them.
  ii. **What**: let's assume there is some global variable in memory (e.g. set by some other part of the Rails application, such as Rack or Sidekiq.) containing a unique identifier and whether or not this is a web request. It would be great if we could know what line number this query originated from as well, but sticking an entire call stack into a SQL comment seems garish. Let's consider options around this lastly as a finishing garnish.


## 1. Solving the exfiltration problem

Nowadays we can chat with ChatGPT to get a jumpstart on unfamiliar problem-spaces. It did not disappoint in producing a solution. Note that this solution uses the internal `pg_cron` extension, so I am adding the steps and then we'll get into installing and using ChatGPT's solution. Let's begin:

Create **Dockerfile**

```dockerfile
FROM postgres:15.1-bullseye
RUN apt-get update && apt-get -y install git build-essential postgresql-server-dev-15
RUN git clone https://github.com/citusdata/pg_cron.git
RUN cd pg_cron && make && make install
```

Build it. *Note I tried to use postgres:11 but apt was broken there, so we'll be using postgres 15. Depending on when you're reading this, you may have the same issue with postgres 15, and maybe bumping the versions will work for you too, future person.*

```powershell
docker build -t pgwcron .
```

Create **postgresql.conf**

```conf
listen_addresses = '*'

# Read about pg_cron and how to set it up and use it on
# CitusData's pg_cron repo: https://github.com/citusdata/pg_cron

# required to load pg_cron background worker on start-up
shared_preload_libraries = 'pg_cron'

# optionally, specify the database in which the pg_cron background worker should run (defaults to postgres)
cron.database_name = 'postgres'

# optionally, specify the timezone in which the pg_cron background worker should run (defaults to GMT). E.g:
cron.timezone = 'GMT'
```

Start the server

```powershell
docker run --rm --name trace-postgres -v $PWD/postgresql.conf:/etc/postgresql/postgresql.conf -e POSTGRES_PASSWORD=pass pgwcron -c 'config_file=/etc/postgresql/postgresql.conf'
```

Start a client

```powershell
docker exec -it $(docker inspect --format="{{.Id}}" trace-postgres) psql -U postgres
```

Install the `pg_cron` extension by executing the following SQL statement:

```sql
CREATE EXTENSION pg_cron;
```

And now we can use ChatGPT's solution. Note that I had to fix some small errors it made, so the solution you see here is tested working:

> This function will use the `RAISE NOTICE` statement to output a message for each active query in the `pg_stat_activity` view that has been running for more than 1 minute, with the current timestamp, process ID, username, and query text. These messages will be written to the PostgreSQL log file, which is specified in the `log_destination` configuration parameter in the `postgresql.conf` file.

```sql
CREATE OR REPLACE FUNCTION log_active_queries()
RETURNS void AS
$BODY$
DECLARE
  query record;
BEGIN
  FOR query
  IN SELECT * FROM pg_stat_activity
  WHERE state != 'idle' AND age(now(), query_start) > INTERVAL '1 minute'
  LOOP
    RAISE NOTICE 'Active queries as of % at pid %: %', now(), query.pid, query.query;
  END LOOP;
END;
$BODY$
LANGUAGE plpgsql;
```

> To schedule this modified function to run every minute, you can use the `pg_cron` extension as follows:

```sql
SELECT cron.schedule('log_active_queries', '* * * * *', $$SELECT log_active_queries();$$);
```

> To stop a scheduled job that was created using the pg_cron extension, you can use the cron.unschedule function as follows:

```sql
SELECT cron.unschedule('log_active_queries');
```

Now let's create some long running jobs with annotations and see if it gets logged. I will run this a few times simultaneously using multiple terminal shells.

```powershell
docker exec -it $(docker inspect --format="{{.Id}}" trace-postgres) psql -U postgres -c 'SELECT pg_sleep(120) /* Hello */;'
```

Looks like it works! In our logs we can see the long running query along with its tracer comment:

```
NOTICE:  Active queries as of 2022-12-28 01:18:00.057665+00 at pid 114: SELECT pg_sleep(120) /* Hello */;
NOTICE:  Active queries as of 2022-12-28 01:18:00.057665+00 at pid 121: SELECT pg_sleep(320) /* Hello */;
NOTICE:  Active queries as of 2022-12-28 01:18:00.057665+00 at pid 128: SELECT pg_sleep(620) /* Hell3o */;
```

We should want to improve the function now to show possibly other columns from `pg_stat_activity` which might be useful, or any other changes. But let's move on from here having proved this approach.

## 2. Solving the injection problem (from Rails)

Here is a [clean monkey patch](https://blog.daveallie.com/clean-monkey-patching) which annotates SQL queries executed by the PG::Connection class (the underlying connection used by ActiveRecord):

Create **sqlannotator.rb** in `config/initializers`

```ruby
# https://blog.daveallie.com/clean-monkey-patching
module PGConnectionAnnotationExt
  module SQLAnnotator
    def self.annotate(sql)
      # Customize the SQL comment to contain your trace identifier.
      sql += "/* My Annotation */"
    end
  end

  def async_exec(sql, *params)
    super(SQLAnnotator.annotate(sql), *params)
  end

  def exec(sql, *params)
    super(SQLAnnotator.annotate(sql), *params)
  end
end

PG::Connection.prepend(PGConnectionAnnotationExt)
```

To test it, perform any SQL query, or directly use the connection instance like so:

```ruby
ActiveRecord::Base.connection.raw_connection.async_exec("SELECT now();") 
# or 
ActiveRecord::Base.connection.execute("SELECT now();")
# or, if you have a model you can use:
User.all
```

This works! You can emulate a lockup situation easily like so, and then check if it's being logged.

1. open up a rails database console shell and explicitly lock your table:

```SQL
BEGIN;
LOCK TABLE users;
```

2. leave that open, and open a rails console and run

```
User.all
```

It should get stuck...

3. Now go look at your logs, or use the `psql` shell to check pg_stat_activity:

```
app=# select pid,query from pg_stat_activity where state = 'active';
 pid |                             query
-----+----------------------------------------------------------------
 327 | select pid,query from pg_stat_activity where state = 'active';
 333 | SELECT "users".* FROM "users"/* My Annotation */
(2 rows)
```

There's our annotation! We're done. Just one more thing and that's cleaning up this mess.

At this point I wanted to cancel the queries and found a nice [answer from Andong Zhan](https://stackoverflow.com/a/35319598/511621) was helpful:

> What I did is first check what are the running processes by

```SQL
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

> Find the process you want to kill, then type:

```SQL
SELECT pg_cancel_backend(<pid of the process>)
```

> This basically "starts" a request to terminate gracefully, which may be satisfied after some time, though the query comes back immediately.

> If the process cannot be killed, try:

```SQL
SELECT pg_terminate_backend(<pid of the process>)
```
