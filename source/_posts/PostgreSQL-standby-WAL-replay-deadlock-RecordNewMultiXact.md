---
title: PostgreSQL standby WAL replay deadlocks in RecordNewMultiXact when the primary is on an older minor version
date: 2026-05-23 18:42:00
tags:
  - postgresql
  - debugging
  - operations
  - ubuntu
---

A streaming replica on PostgreSQL 14.23 stops replaying WAL coming from a primary on 14.17. The startup process self-deadlocks acquiring `MultiXactOffsetSLRULock` inside `RecordNewMultiXact` → `SimpleLruWriteAll`. The bug is in the back-patched compatibility code introduced by commit `789d65364c` ("Set next multixid's offset when creating a new multixid") and partially addressed by `c60a58204435` in 14.22. This post documents the symptoms, diagnosis, and a workaround.

<!-- more -->

# Environment

- Primary: PostgreSQL 14.17 (Ubuntu 14.17-1.pgdg20.04+1), Ubuntu 20.04 (focal), aarch64
- Standby: PostgreSQL 14.23 (Ubuntu 14.23-1.pgdg22.04+1), Ubuntu 22.04 (jammy), amd64
- Streaming replication, archived WAL via pgBackRest 2.55.1
- TimescaleDB loaded via `shared_preload_libraries`, present as extension 2.17.2 in one database

# Symptoms

`pg_stat_replication` on the primary, with `sent_lsn`/`write_lsn`/`flush_lsn` current but `replay_lsn` frozen:

```
 client_addr | state     | sent_lsn    | write_lsn   | flush_lsn   | replay_lsn  | write_lag | replay_lag
-------------+-----------+-------------+-------------+-------------+-------------+-----------+------------
 <replica>   | streaming | 54/DAC90878 | 54/DAC90878 | 54/DAC90878 | 54/B6F3A5B8 | <recent>  | ~1.5 days
```

On the standby, the receive LSN advances normally while replay LSN does not:

```
 pg_last_wal_receive_lsn | pg_last_wal_replay_lsn |       lag
-------------------------+------------------------+-----------------
 54/DAC9B1E8             | 54/B6F3A5B8            | 1 day 14:51:50
```

Approximately 600 MB of WAL received but unreplayed. Replication lag grows 1:1 with wall-clock time.

The startup process is alive but uses no CPU:

```
$ ps -p $(pgrep -f 'startup recovering') -o pid,etime,time,cmd
    PID     ELAPSED     TIME CMD
2088872 1-04:21:34 00:00:00 postgres: 14/main: startup recovering 0000000100000054000000B6
```

No errors are emitted to the log after the initial recovery setup. `pg_stat_database_conflicts` reports zero conflicts. `max_standby_streaming_delay` was the default 30s. No long-running queries were holding back replay; in fact the same hang occurs before consistent recovery state is reached, with no client backends connected.

The startup process is sleeping on a futex with no timeout:

```
$ sudo timeout 5 strace -p 2088872 2>&1 | tail
strace: Process 2088872 attached
futex(0x..., FUTEX_WAIT_BITSET|FUTEX_CLOCK_REALTIME, 0, NULL, ...) = ?
```

# Stuck WAL record

The replay LSN identifies the record being processed at the freeze. Using `pgbackrest archive-get` to fetch the segment from the archive and `pg_waldump` to inspect it:

```bash
sudo -u postgres pgbackrest --stanza=<STANZA> archive-get \
  0000000100000054000000D5 /tmp/0000000100000054000000D5

sudo /usr/lib/postgresql/14/bin/pg_waldump /tmp/0000000100000054000000D5 \
  --start=54/D5234400 --end=54/D5234500
```

```
rmgr: MultiXact   len (rec/tot): 54/54, tx: 228676118,
      lsn: 54/D5234408, prev 54/D52343C8,
      desc: CREATE_ID 68812799 offset 154322156 nmembers 2: ... (keysh) ... (keysh)
```

Multixact ID `68812799` is the last entry in offsets file `0419`:

- 65536 entries per offsets segment file
- `68812799 / 65536 = 1049.99…`
- `68812799 = 1050 × 65536 - 1`
- The next multixact (`68812800`) would belong to a new segment file (`041A`)

The first hang (at LSN `54/B6F3A5B8`, mxid `68763647`) was on the same kind of record — a `MultiXact/CREATE_ID` near the boundary into a new SLRU offsets segment. Both freezes were deterministic; the standby reproduced the hang at the same LSN across repeated restarts.

# Stack trace

After installing `postgresql-14-dbgsym` and attaching gdb to the stuck startup process:

```
#7  LWLockAcquire (lock=0x7f1450553180, mode=LW_EXCLUSIVE) at lwlock.c:1325
#8  SimpleLruWriteAll (ctl=MultiXactOffsetCtlData, allow_redirtied=...) at slru.c:1173
#9  RecordNewMultiXact (multi=68812799, offset=154322156, nmembers=2, ...) at multixact.c:943
#10 multixact_redo (record=...) at multixact.c:3468
#11 StartupXLOG () at xlog.c:7576
```

Relevant locals on frame #9:

```
pageno = 33599
entryno = 2047
```

(`pageno = 33599` is the last page of segment file `0419`; `entryno = 2047` is the last entry on that page.)

The checkpointer was blocked on the same lock via a different path:

```
#7  LWLockAcquire (lock=0x7f1450553180, mode=LW_EXCLUSIVE)
#8  SimpleLruWriteAll (ctl=MultiXactOffsetCtlData, ...)
#9  CheckPointMultiXact ()
#10 CheckPointGuts (...)
#11 CreateRestartPoint (flags=256)
#12 CheckpointerMain ()
```

# LWLock state

Reading the lock structure directly:

```
$ sudo gdb -p <startup-pid> -batch \
    -ex 'print *(LWLock*)0x7f1450553180' -ex 'detach' -ex 'quit'

$1 = {
  tranche = 14,
  state = { value = 1627389952 },          # 0x61000000
  waiters = { head = 237, tail = 238 }
}
```

Decoding `state.value = 0x61000000`:

| Bit         | Flag                  | Set? |
|-------------|-----------------------|------|
| `0x40000000`| `LW_FLAG_HAS_WAITERS` | yes  |
| `0x20000000`| `LW_FLAG_RELEASE_OK`  | yes  |
| `0x01000000`| `LW_VAL_EXCLUSIVE`    | yes  |
| `0x00FFFFFF`| shared-holder count   | 0    |

The lock is held exclusive, with two PGPROCs queued behind it. No third PostgreSQL process is in any SLRU code path — only the startup process and the checkpointer exist (plus postmaster and background writer, which are in their idle loops). The exclusive holder is therefore the startup process itself: `RecordNewMultiXact` acquires `MultiXactOffsetSLRULock` exclusively at the start of the function, reaches the segment-extension branch, and calls `SimpleLruWriteAll`, whose first action is to acquire the same lock exclusively. PostgreSQL LWLocks are not recursive. The process queues itself on the wait list for the lock it already holds.

# Related upstream patches

This appears to be related to but not fully resolved by the following work:

- 2025-06-25: Thread *"IPC/MultixactCreation on the Standby server"* opened by Dmitry @ Yandex on pgsql-hackers ([message-id 172e5723-d65f-4eec-b512-14beacb326ce@yandex.ru](https://www.postgresql.org/message-id/172e5723-d65f-4eec-b512-14beacb326ce@yandex.ru)). The reproduction targeted PG17/18 client backends hanging on `IPC/MultixactCreation`; the reporter notes the issue is not reproducible on PG16.9.
- 2025-12-03: Commit `789d65364c` *"Set next multixid's offset when creating a new multixid"* by Andrey Borodin / committer Heikki Linnakangas. Back-patched to all supported versions.
- 2025-12-05: Commit `4d689a17693` *"Fix setting next multixid's offset at offset wraparound"*. Back-patched.
- 2026-02-12: Released in 14.21, 15.16, 16.12, 17.8, 18.2.
- 2026-02-16: Commit `c60a58204435` (Michael Paquier) *"Fix failure to replay WAL generated on older minor versions"*. Back-patched 14–18.
- 2026-02-26: Out-of-cycle release of 14.22, 15.17, 16.13, 17.9, 18.3 to address the above regression. 14.22 release notes:
  > "Fix failure after replaying a multixid truncation record from WAL that was generated by an older minor version (Heikki Linnakangas). Erroneous logic for coping with the way that previous versions handled multixid wraparound led to replay failure, with messages like 'could not access status of transaction'. A typical scenario in which this could occur is a standby server of the latest minor version consuming WAL from a primary server of an older version."

The case documented here is a different failure mode (a self-deadlock during replay, not a `could not access status of transaction` error) in the same cross-minor-version scenario that 14.22 was supposed to fully cover. The standby was on 14.23, which contains both patches; the primary was on 14.17, which generates WAL in the pre-fix format. The hang occurs deterministically at the WAL record listed above.

# Reproduction conditions

From available evidence:

- A primary running a minor version older than the fix (14.17 here; presumably any 14.x ≤ 14.20).
- A standby running a minor version that contains the back-patched compat code (14.21+).
- The standby replaying a `MULTIXACT/CREATE_ID` WAL record where the multixact ID is the last entry of the current offsets segment file (i.e., a record that triggers the SLRU segment-extension branch in `RecordNewMultiXact`).
- The checkpointer running a restartpoint concurrently is not required for the deadlock (the startup process is by itself sufficient because of the self-recursive lock acquisition), but it amplifies it.

The standby has been observed to deadlock at this code path on at least two distinct multixact IDs (`68763647` and `68812799`) on different occasions, each at a segment-boundary record.

# Workaround

Align minor versions on both sides. With both standby and primary on the same minor version, the cross-version compat code path is not exercised. Either:

1. **Upgrade primary** to 14.21+ to match the standby. This was not viable in this case because Ubuntu 20.04 was EOL'd by Ubuntu in April 2025, and PostgreSQL global development group [removed focal from `apt.postgresql.org` in July 2025](https://www.postgresql.org/message-id/aItWGvIAWFEsLqds@msg.df7cb.de). The archive at `apt-archive.postgresql.org` only holds focal builds up to **14.18**. Upgrading the OS is the prerequisite to upgrading PostgreSQL on that host.
2. **Downgrade standby** to match the primary. This is what was actually done.

For (2), the standby was on PGDG packages for jammy. The PGDG main repo retains only the most recent few minor versions; older versions are at `apt-archive.postgresql.org`:

```bash
echo "deb https://apt-archive.postgresql.org/pub/repos/apt jammy-pgdg-archive main" \
  | sudo tee /etc/apt/sources.list.d/pgdg-archive.list
sudo apt update
apt-cache madison postgresql-14
```

Stop the cluster and install the older version explicitly:

```bash
sudo systemctl stop postgresql@14-main
sudo pkill -9 -f 'postgres.*14/main' 2>/dev/null

sudo apt install \
  postgresql-14=14.17-1.pgdg22.04+1 \
  postgresql-client-14=14.17-1.pgdg22.04+1

sudo apt-mark hold postgresql-14 postgresql-client-14
```

Holding the packages prevents an unattended upgrade from silently moving the standby back into the buggy version range. If TimescaleDB is installed, hold those packages too:

```bash
sudo apt-mark hold \
  timescaledb-2-postgresql-14 \
  timescaledb-2-loader-postgresql-14 \
  timescaledb-toolkit-postgresql-14 \
  timescaledb-tools
```

Same-major-version downgrade reads the existing data directory; PostgreSQL guarantees on-disk and WAL format compatibility within a major version.

After downgrade, the standby replayed past the previously-stuck LSN without further intervention and resumed streaming from the primary.

# Diagnostic command reference

```bash
# Receive vs replay progression on standby
sudo -u postgres psql -c \
  "SELECT pg_last_wal_receive_lsn(), pg_last_wal_replay_lsn(),
          now() - pg_last_xact_replay_timestamp() AS lag;"

# CPU usage of startup process — frozen vs slow
ps -p $(pgrep -f 'startup recovering') -o pid,etime,time,cmd

# Where the startup process is blocked
sudo timeout 5 strace -p $(pgrep -f 'startup recovering') 2>&1 | tail

# Full stack (requires postgresql-14-dbgsym)
sudo gdb -p $(pgrep -f 'startup recovering') -batch \
  -ex 'set pagination off' \
  -ex 'thread apply all bt full' \
  -ex 'detach' -ex 'quit'

# Inspect LWLock state by address (taken from gdb backtrace)
sudo gdb -p <startup-pid> -batch \
  -ex 'set print pretty on' \
  -ex 'print *(LWLock*)<addr>' \
  -ex 'print/x ((LWLock*)<addr>)->state.value' \
  -ex 'detach' -ex 'quit'

# Backtraces of all postgres processes (to locate any LWLock holder)
for pid in $(pgrep -f 'postgres:'); do
  echo "=== PID $pid ==="
  ps -p $pid -o pid,comm,args --no-headers
  sudo gdb -p $pid -batch -ex 'bt' -ex 'detach' -ex 'quit' 2>&1 | grep '^#'
done

# WAL record at the stuck LSN
sudo -u postgres pgbackrest --stanza=<STANZA> archive-get \
  <SEGMENT> /tmp/<SEGMENT>
sudo /usr/lib/postgresql/14/bin/pg_waldump /tmp/<SEGMENT> \
  --start=<LSN> --end=<LSN+0x100>
```
