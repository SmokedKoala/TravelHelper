#!/bin/bash
set -e

# Create user for the application
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER travelhelper_user WITH PASSWORD 'travelhelper_password';
    GRANT ALL PRIVILEGES ON DATABASE "$POSTGRES_DB" TO travelhelper_user;
EOSQL

# Create schema in the database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE SCHEMA IF NOT EXISTS travelhelper_schema;
    GRANT ALL PRIVILEGES ON SCHEMA travelhelper_schema TO travelhelper_user;
    GRANT USAGE ON SCHEMA travelhelper_schema TO travelhelper_user;
    ALTER DEFAULT PRIVILEGES IN SCHEMA travelhelper_schema GRANT ALL ON TABLES TO travelhelper_user;
    ALTER DEFAULT PRIVILEGES IN SCHEMA travelhelper_schema GRANT ALL ON SEQUENCES TO travelhelper_user;
    ALTER USER travelhelper_user SET search_path TO travelhelper_schema, public;
EOSQL

# Drop the default postgres database (connect to our app database first)
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = 'postgres'
      AND pid <> pg_backend_pid();
    
    DROP DATABASE IF EXISTS postgres;
EOSQL

