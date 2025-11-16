# Database Setup Guide

## Overview

The loan automation platform uses PostgreSQL with Prisma ORM for data persistence.

## Prerequisites

1. **PostgreSQL** installed and running
   - Download: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

## Setup Steps

### 1. Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the postgres user password

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE loan_automation;

-- Create user (optional)
CREATE USER loan_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE loan_automation TO loan_user;
```

### 3. Configure Environment Variables

Create `.env` file in `services/loan-service/`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/loan_automation?schema=public"
WORKFLOW_SERVICE_URL=http://localhost:4004
DOCUMENT_SERVICE_URL=http://localhost:4003
PORT=4002
```

### 4. Install Prisma and Generate Client

```bash
cd services/loan-service
pnpm install
pnpm db:generate
```

### 5. Run Migrations

```bash
pnpm db:migrate
```

This will create all the database tables.

### 6. (Optional) Open Prisma Studio

```bash
pnpm db:studio
```

This opens a GUI to view/edit database records.

## Database Schema

The schema includes:
- **Borrower** - Borrower information
- **LoanApplication** - Loan applications
- **Document** - Uploaded documents
- **UnderwritingCondition** - Underwriting conditions

## Switching from In-Memory to Database

The loan service has two route files:
- `routes.ts` - Uses in-memory storage (current default)
- `routes-db.ts` - Uses PostgreSQL database

To switch to database:

1. Update `src/main.ts`:
   ```typescript
   // Change from:
   import routes from './routes';
   // To:
   import routes from './routes-db';
   ```

2. Make sure database is set up and migrations are run

3. Restart the service

## Troubleshooting

### "Can't reach database server"
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify port 5432 is accessible

### "Relation does not exist"
- Run migrations: `pnpm db:migrate`
- Or generate Prisma client: `pnpm db:generate`

### Connection refused
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in DATABASE_URL

## Production Considerations

- Use connection pooling
- Set up database backups
- Use environment-specific DATABASE_URL
- Enable SSL for database connections
- Use read replicas for scaling

