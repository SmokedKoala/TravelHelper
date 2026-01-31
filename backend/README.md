# Backend Service

This folder will contain the backend service implementation.

## Planned Structure

- API endpoints for flight and hotel searches
- Integration with travel booking services
- Data aggregation and processing

## API Endpoints (Planned)

- `POST /api/flights/search` - Search for flights
- `POST /api/hotels/search` - Search for hotels
- `POST /api/search/combined` - Combined search for flights and hotels

## Database Setup

### Running PostgreSQL with Docker

To start a local PostgreSQL database container with the initialization script:

```bash
docker run --name travelhelper-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=travelhelper_db \
  -p 5432:5432 \
  -v "$(pwd)/src/test/resources/init.sh:/docker-entrypoint-initdb.d/init.sh" \
  -d postgres:latest
```

Or on Windows PowerShell:

```powershell
docker run --name travelhelper-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_DB=travelhelper_db `
  -p 5432:5432 `
  -v "${PWD}/src/test/resources/init.sh:/docker-entrypoint-initdb.d/init.sh" `
  -d postgres:latest
```

**Note:** Make sure the `init.sh` file has execute permissions. On Linux/Mac, you can set it with:
```bash
chmod +x src/test/resources/init.sh
```

This will:
- Create a PostgreSQL container named `travelhelper-postgres`
- Create only the `travelhelper_db` database (no default postgres database)
- Expose PostgreSQL on port `5432`
- Automatically execute `init.sh` on first startup to create the user and schema
- Use the default PostgreSQL credentials for the superuser (postgres/postgres)

### Stopping and Removing the Container

To stop the container:
```bash
docker stop travelhelper-postgres
```

To remove the container:
```bash
docker rm travelhelper-postgres
```

### Database Credentials

- **Database**: travelhelper_db
- **Schema**: travelhelper_schema
- **User**: travelhelper_user
- **Password**: travelhelper_password

