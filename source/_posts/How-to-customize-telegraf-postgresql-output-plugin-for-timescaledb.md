---
title: How to customize telegraf postgresql output plugin for timescaledb
date: 2023-04-16 18:53:55
tags:
---

In the telegraf.conf file we can see the following snippet commented out

```
## Templated statements to execute when creating a new table.
create_templates = [
  '''CREATE TABLE {{ .table }} ({{ .columns }})''',
]
```

We can alter this to fit a timescaledb setup like so:


```
## Templated statements to execute when creating a new table.
create_templates = [
  '''
  CREATE TABLE {{ .table }} ({{ .columns }})
  SELECT create_hypertable('{{ .table }}', 'time');
  SELECT add_retention_policy('{{ .table }}', INTERVAL '2 weeks');  
  ''',
]
```

# Full Example

Here is what I am using on windows to send my nvidia gpu metrics:

**C:\Program Files\Telegraf\telegraf.d\telegraf.conf**

```
[global_tags]
[agent]
  interval = "10s"
  round_interval = true
  metric_batch_size = 1000
  metric_buffer_limit = 10000
  collection_jitter = "0s"
  flush_interval = "10s"
  flush_jitter = "0s"
  precision = "0s"
  hostname = ""
  omit_hostname = false

[[outputs.postgresql]]
  connection = "host=192.168.1.100 user=xxxxx password=xxxxx sslmode=disable dbname=xxxxx"
  create_templates = [
    '''
    CREATE TABLE {{ .table }} ({{ .columns }});
    SELECT create_hypertable('{{ .table }}', 'time');
    SELECT add_retention_policy('{{ .table }}', INTERVAL '2 weeks');  
    ''',
  ]
[[inputs.nvidia_smi]]

```
