---
title: How to trace postgresql database SQL queries
date: 2022-12-22 03:43:42
tags:
- postgresql
- traceability
---

let's use docker to quickly prove the concept of sending arbitrary trace strings into our postgres logs.

this is an idea suggested to me by buu in the postgres IRC channel (thanks). let's prove it step by step:

1. get the image

```
docker pull postgres:11
```

2. get a config file

```
docker run --rm -it postgres:11 cat /usr/share/postgresql/postgresql.conf.sample > postgresql.conf
```

3. customize the config file

focus on the sections talking about logs and ignore the rest.

**primarily, we want to set `log_statement = 'all'` as that is what ensures our queries are printed**

4. start the database software

```
docker run --rm --name trace-postgres -v "$PWD/postgresql.conf":/etc/postgresql/postgresql.conf -e POSTGRES_PASSWORD=pass postgres:11 -c 'config_file=/etc/postgresql/postgresql.conf'
```

we should see something like this:

```

PostgreSQL init process complete; ready for start up.

2022-12-22 04:42:34.949 GMT [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2022-12-22 04:42:34.949 GMT [1] LOG:  listening on IPv6 address "::", port 5432
2022-12-22 04:42:34.951 GMT [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2022-12-22 04:42:34.959 GMT [67] LOG:  database system was shut down at 2022-12-22 04:42:34 GMT
2022-12-22 04:42:34.963 GMT [1] LOG:  database system is ready to accept connections
```

5. connect with psql and send a query.

```
docker exec -it $(docker inspect --format="{{.Id}}" trace-postgres) psql -U postgres -c 'select now();'
```

the logs should show this query:

```
2022-12-22 04:44:36.654 GMT [87] LOG:  statement: select now();
```

6. send the query again, this time include a comment (for example, a request ID, or a job ID, whatever you want to bring in from the application space to help you in future endeavors)

```
docker exec -it $(docker inspect --format="{{.Id}}" trace-postgres) psql -U postgres -c 'select now()/*trace_parent=job:12345*/;'
```

now the logs show this query including the comment!

```
2022-12-22 04:50:18.032 GMT [106] LOG:  statement: select now()/*trace_parent=job:12345*/;
```

Thus it appears that it is possible. All that remains is to facilitate injection of a smart identifier into query interface on the application's postgres client.

Further questions...

- What other traceability elements need to be switched on in the configuration for investigative pictures to be more complete?
- Will this be helpful for investigating the root cause of rollbacks and deadlocks?
- What are the logging nuances of rollbacks and deadlocks?
- How can we reduce the noise by using the slow logger when integrating traceability while still retaining the ability to investigate postgres logs effectively?