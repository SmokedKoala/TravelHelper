-- Create PostgreSQL user for backend application
CREATE USER travelhelper_user WITH PASSWORD 'travelhelper_password';

-- Create schema for backend application
CREATE SCHEMA IF NOT EXISTS travelhelper_schema;

-- Grant privileges on schema to the user
GRANT ALL PRIVILEGES ON SCHEMA travelhelper_schema TO travelhelper_user;

-- Grant usage on schema
GRANT USAGE ON SCHEMA travelhelper_schema TO travelhelper_user;

-- Set default privileges for future tables in the schema
ALTER DEFAULT PRIVILEGES IN SCHEMA travelhelper_schema GRANT ALL ON TABLES TO travelhelper_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA travelhelper_schema GRANT ALL ON SEQUENCES TO travelhelper_user;

-- Set search path for the user
ALTER USER travelhelper_user SET search_path TO travelhelper_schema, public;

