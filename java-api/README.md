# LindaJamii — Java Spring Boot API

A Spring Boot REST API handling neighbourhood management and patrol scheduling.  
Runs on **port 8080**.

## Requirements

- Java 11+
- Maven 3.6+

## Build & Run

```bash
# Build (skip tests for speed)
mvn clean package -DskipTests

# Run the JAR
java -jar target/lindajamii-api-1.0.0.jar

# Or use Maven directly
mvn spring-boot:run
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check + uptime |
| GET | `/api` | API root / index |
| GET | `/api/neighbourhoods` | List all neighbourhoods |
| GET | `/api/neighbourhoods/summary` | Aggregated stats |
| GET | `/api/neighbourhoods/{id}` | Get single neighbourhood |
| POST | `/api/neighbourhoods` | Register new neighbourhood |
| PUT | `/api/neighbourhoods/{id}` | Update neighbourhood |
| DELETE | `/api/neighbourhoods/{id}` | Remove neighbourhood |
| GET | `/api/patrols` | List patrols (filter: `?status=scheduled`) |
| GET | `/api/patrols/{id}` | Get single patrol |
| POST | `/api/patrols` | Schedule new patrol |

## Example

```bash
curl http://localhost:8080/api/health
curl http://localhost:8080/api/neighbourhoods/summary
curl "http://localhost:8080/api/patrols?status=active"
```
