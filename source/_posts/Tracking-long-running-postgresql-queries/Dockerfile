FROM postgres:15.1-bullseye
RUN apt-get update && apt-get -y install git build-essential postgresql-server-dev-15
RUN git clone https://github.com/citusdata/pg_cron.git
RUN cd pg_cron && make && make install