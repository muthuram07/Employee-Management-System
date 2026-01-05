# Employee Management System

A simple microservice-based Employee Management System with a React frontend and Spring Boot backend services (including an authentication service and a Eureka service registry).

Repository structure (top-level)
- frontend/FE — React frontend (create-react-app)
- authenticationservice/authenticationservice — Spring Boot authentication service (Maven; Java 21)
- EurekaServer — service registry (Spring Boot)
- employee_management — (service folder present; check for service-specific README or start script)

Status: This README describes how to run the main discovered pieces: the service registry, authentication service, and the frontend.

---

## Quick overview

- Frontend:
  - React app located at `frontend/FE`
  - Start script: `npm start`
  - Dev port: 3000 (default for react-scripts)

- Authentication service:
  - Spring Boot (Maven) located at `authenticationservice/authenticationservice`
  - Uses Java 21 (pom.xml sets java.version to 21)
  - Maven wrapper included (`mvnw` / `mvnw.cmd`)

- Eureka server:
  - Service discovery server located at `EurekaServer` (Spring Boot)
  - Typical Eureka port: 8761 (confirm in service properties)

---

## Prerequisites

- Java 21 (required by the Spring Boot projects)
- Maven (or use the included Maven wrapper `./mvnw`)
- Node.js (recommended >= 18) and npm
- Git

---

## Run locally (development)

1. Clone repository
```bash
git clone https://github.com/muthuram07/Employee-Management-System.git
cd Employee-Management-System
```

2. Start the Eureka service registry
```bash
# from repository root
cd EurekaServer
# if mvnw exists in that folder:
./mvnw spring-boot:run
# or with local maven:
mvn spring-boot:run
```
Open http://localhost:8761 (if the service uses the default port) to confirm the registry is up.

3. Start the authentication service
```bash
cd ../authenticationservice/authenticationservice
./mvnw spring-boot:run
# or
mvn spring-boot:run
```
Default Spring Boot port is 8080 unless overridden in application properties. The service should register with Eureka if Eureka is running and the configuration points to it.

4. Start the frontend (React)
```bash
cd ../../frontend/FE
npm install
npm start
```
Visit http://localhost:3000 to open the frontend in development mode. Adjust API base URLs in the frontend configuration if necessary (check `src` for API base variables or environment files).

---

## Build for production

- Frontend
```bash
cd frontend/FE
npm install
npm run build
# build artifacts are placed in frontend/FE/build
```

- Backend services (package JAR)
```bash
# example for authentication service
cd authenticationservice/authenticationservice
./mvnw clean package
# run the generated jar:
java -jar target/authenticationservice-0.0.1-SNAPSHOT.jar
```

---

## Environment / Configuration

- Spring Boot services usually read `application.properties` or `application.yml`. Common values to check:
  - server.port
  - eureka.client.serviceUrl.defaultZone (Eureka server URL)
  - datasource.* (if the service connects to a DB)
  - jwt secrets or auth configs for the authentication service

- Frontend environment variables (if used):
  - Check `frontend/FE/.env` or `src` for where the API base URL is set (commonly REACT_APP_API_URL or similar).

Do not commit credentials or secrets. Use environment variables or CI/CD secrets for production.

---

## Notes & troubleshooting

- If a Spring Boot service fails to start:
  - Ensure Java 21 is installed and JAVA_HOME is set correctly.
  - Check logs for binding port issues or missing configuration (e.g., Eureka URL, database).
- If the frontend cannot reach the backend:
  - Confirm the backend is running.
  - Update the frontend's API base URL to point to the backend (including the correct port).
  - For cross-origin issues, ensure CORS is allowed on the backend in development.
- If a service does not register with Eureka:
  - Check that the Eureka URL is correct in that service's properties and that Eureka is reachable.

---

## Tests

- Frontend: run `npm test` in `frontend/FE`.
- Backend: run `./mvnw test` in the relevant Spring Boot service directories.

---

## License

Check the repository `LICENSE` file. If none present, add your preferred license (MIT is common).

---

## Contact

Repository: https://github.com/muthuram07/Employee-Management-System  
Author / Maintainer: muthuram07

---

