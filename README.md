# Jasamarga API Project Setup Guide

This project is a Node.js application using **Express.js** and **PostgreSQL** as the database, managed with **Sequelize ORM**. You can run it **locally** or with **Docker**.

## 📂 Project Structure

```

PROJECT_FOLDER

│── src/

│   ├── @types/          # Custom TypeScript types

│   ├── database/        # Sequelize models & DB connection

│   ├── features/        # Business logic

│   ├── helpers/         # Utility functions (logger, response helper)

│   ├── server/          # Middleware & custom exceptions

│   ├── app.ts           # Main Express app instance

│   ├── routes.ts        # API routes

│── .env.example         # Example env file

│── .dockerignore        # Ignore files for Docker

│── .gitignore           # Ignore files for Git

│── .prettierrc          # Code formatting config

│── Dockerfile           # Docker build instructions

│── docker-compose.yml   # Docker Compose setup

│── package.json         # Dependencies & scripts

│── tsconfig.json        # TypeScript config

```

## 🚀 Getting Started

### 1️⃣ Local Installation

#### **Prerequisites**

- **Node.js** (v18+)
- **PostgreSQL** (Ensure it's running locally)

#### **Setup & Run**

```sh

# Init the migration (use raw SQL directly)

cd RAW_QUERY


psql -U your_user -d your_database -f 1-create_database_data_kepegawaian.sql

psql -U your_user -d your_database -f 2-create_table_employee_profile.sql

psql -U your_user -d your_database -f 3-create_table_employee.sql

psql -U your_user -d your_database -f 4-create_table_education.sql

psql -U your_user -d your_database -f 5-create_table_employee_family.sql

psql -U your_user -d your_database -f 6-create_relation_table.sql

psql -U your_user -d your_database -f 7-create_seeder_on_all_tables.sql

psql -U your_user -d your_database -f 9-create_materialized_view_employee_report.sql


# After executing migration go to the project folder

cd ..

cd PROJECT_FOLDER


# Copy example environment variables

cp .env.example .env


# Update .env file with database credentials


# Start the server

npm run dev

```

#### **Environment Variables (.env)**

```ini

PORT=3000

DB_HOST=localhost

DB_PORT=5432

DB_USER=myuser

DB_PASSWORD=mypassword

DB_NAME=mydatabase

```

### 2️⃣ Running with Docker 🐳

#### **Build & Start Containers**

```sh

# Start PostgreSQL & Express.js using Docker Compose

docker-compose up -d

```

#### **Stop Containers**

```sh

docker-compose down

```

#### **Accessing Services**

- **API**: `http://localhost:3000`
- **PostgreSQL**: Available inside Docker on `postgres:5432`

### 🛠 Useful Commands

| Command | Description |

|---------|-------------|

| `npm run dev` | Start development server |

| `npm run build` | Compile TypeScript files |

| `npm start` | Run compiled JavaScript code |

| `docker-compose up -d` | Start services with Docker |

| `docker-compose down` | Stop services |
