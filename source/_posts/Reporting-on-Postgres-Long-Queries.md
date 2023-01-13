---
title: Reporting on Postgres Long Queries
date: 2023-01-13 11:04:42
tags:
- bash
- traceability
- postgresql
---

In {% post_link Tracking-long-running-postgresql-queries %} we learned how to extract long queries.
The technique used means that a long query will be printed repeatedly, but we are only interested in the last report.
I used ChatGPT to ask for what I wanted and it provided the following script.


```bash
#!/bin/bash

# Create an empty associative array to store the ages for each pid
declare -A pids

# Read the file line by line
while read line; do
  # Extract the pid and age from the line using regular expressions
  pid=$(echo $line | grep -oP '(?<=pid:)[0-9]+')
  age=$(echo $line | grep -oP '(?<=age:)[0-9:]+')
  
  # Check if the pid and age are valid
  if [ -z "$pid" ] || [ -z "$age" ]; then
    continue
  fi

  # Convert the age string to seconds
  age_seconds=$(date -ud "$age" +%s)

  # If the pid already exists in the array, check if the current age is greater than the stored age
  if [ -v pids[$pid] ]; then
    if [ $age_seconds -gt ${pids[$pid]} ]; then
      pids[$pid]=$age_seconds
    fi
  else
    # If the pid does not exist in the array, add it with the current age
    pids[$pid]=$age_seconds
  fi
done < report_long_queries.txt

for pid in $(printf '%s\n' "${!pids[@]}" | sort -nr); do
  echo "PID: $pid, Age: $(date -ud "@${pids[$pid]}" +%T)"
done
```

The results:

```
PID: 2081628, Age: 00:10:49
PID: 2081619, Age: 00:07:55
PID: 2081618, Age: 00:07:55
PID: 2081615, Age: 00:07:57
PID: 2081614, Age: 00:07:57
PID: 2081584, Age: 00:08:03
PID: 2081583, Age: 00:08:03
PID: 2081066, Age: 00:18:49
PID: 2077867, Age: 00:08:03
PID: 2077818, Age: 00:18:50
PID: 2076340, Age: 00:18:54
PID: 2076338, Age: 00:18:52
PID: 2076336, Age: 00:18:48
PID: 2076276, Age: 00:10:49
PID: 2074986, Age: 00:18:48
PID: 2074383, Age: 00:18:54
PID: 2072062, Age: 00:18:48
PID: 2071413, Age: 00:07:55
PID: 2071412, Age: 00:18:48
PID: 2070435, Age: 00:07:57
PID: 2070432, Age: 00:18:48
PID: 2069583, Age: 00:18:54
```
