# FleetForge

FleetForge is a fleet-management web application created for the WGU Software Engineering Capstone. It allows a fleet manager to organize vehicles, drivers, vehicle assignments, maintenance records, and reports from one centralized application.

## Features

- Secure administrator login and logout
- Vehicle management
- Driver management
- Driver-to-vehicle assignments
- Scheduled and completed maintenance tracking
- Vehicle, driver, and maintenance reports
- CSV report downloads
- Search and sorting
- Form validation
- Responsive React interface

## Technologies

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Maven
- JUnit
- Mockito

### Frontend

- React
- Vite
- JavaScript
- CSS
- Lucide React

### Database and Deployment

- PostgreSQL
- pgAdmin
- Docker
- Google Cloud Build
- Google Artifact Registry
- Google Cloud Run
- Google Cloud SQL
- Google Secret Manager

### Development and Design Tools

- IntelliJ IDEA
- Visual Studio Code
- Postman
- Git
- GitLab
- Figma
- SmartDraw

## Project Structure

```text
d424-software-engineering-capstone/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   └── test/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── Dockerfile
├── .dockerignore
└── README.md
```

- `backend` contains the Spring Boot API, database entities, services, controllers, repositories, security configuration, and tests.
- `frontend` contains the React interface and application styling.
- `Dockerfile` builds the frontend and backend into the deployed application.

## Local Requirements

The following software is required to run FleetForge locally:

- Java 21
- Maven, or the included Maven wrapper
- Node.js
- npm
- PostgreSQL

## Environment Variables

FleetForge requires the following environment variables:

```text
DB_URL=jdbc:postgresql://localhost:5432/fleetforge
DB_USERNAME=[PostgreSQL username]
DB_PASSWORD=[PostgreSQL password]
ADMIN_NAME=Fleet Manager
ADMIN_EMAIL=[administrator email]
ADMIN_PASSWORD=[administrator password]
```

Replace each bracketed value with the appropriate local value. Do not commit real passwords, access tokens, or other private credentials to Git.

## Database Setup

1. Start PostgreSQL.
2. Create a PostgreSQL database named `fleetforge`.
3. Configure the required environment variables.
4. Start the backend application.
5. Spring Boot will create or update the required database tables.

## Running the Backend

Open a terminal at the project root:

```bash
cd backend
./mvnw spring-boot:run
```

The backend runs at:

```text
http://localhost:8080
```

On Windows, use:

```powershell
cd backend
mvnw.cmd spring-boot:run
```

## Running the Frontend

Open a second terminal at the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the URL displayed by Vite. The default address is:

```text
http://localhost:5173
```

If port `5173` is already being used, Vite may select another port.

## Running the Tests

Run the backend unit tests:

```bash
cd backend
./mvnw test
```

On Windows:

```powershell
cd backend
mvnw.cmd test
```

Run the frontend lint and production build checks:

```bash
cd frontend
npm run lint
npm run build
```

## Production Application

FleetForge is deployed using Google Cloud Run:

[Open the FleetForge application](https://fleetforge-591716338186.us-east1.run.app/)

Administrator credentials are provided separately and are not stored in this repository.

## Reports

FleetForge provides separate reports for:

- Vehicles
- Drivers
- Maintenance records

Reports can be viewed and sorted within the application. Each report can also be downloaded separately as a CSV file.

## Validation and Security

FleetForge includes:

- Required-field validation
- Email-format validation
- Unique email, VIN, and registration-number constraints
- Nonnegative mileage and cost validation
- BCrypt password hashing
- Session-based authentication
- Protected application pages and API endpoints
- Credentials supplied through environment variables and Google Secret Manager

## Deployment

The production deployment uses:

1. Docker to package the frontend and backend.
2. Google Cloud Build to create the container image.
3. Google Artifact Registry to store the image.
4. Google Cloud Run to host the application.
5. Google Cloud SQL to host the PostgreSQL database.
6. Google Secret Manager to protect database and administrator credentials.

## Version Control

GitLab was used for version control. Development was completed on the `working_branch` branch, which contains the project source code and commit history.

## Author

Erick Cordon  
WGU Software Engineering Capstone