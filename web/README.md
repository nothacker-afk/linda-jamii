# LindaJamii — Web Frontend

A modern, responsive HTML/CSS/JS single-page application for the LindaJamii community safety platform.

## Features

- **Live Incident Feed** — fetches and filters incidents from the Python API
- **Neighbourhood Map** — animated safety map with colour-coded pins
- **Patrol Schedule** — displays active, scheduled, and completed patrols from the Java API
- **Safety Alerts Banner** — real-time alerts from the Python API
- **System Status Panel** — live health checks for all three backend services
- **DJB2 Hash Tool** — interactive demo of the C micro-service
- **Report Incident Modal** — POST new incidents directly to the Python API

## Running

Simply open `index.html` in a browser, or serve it with any static file server:

```bash
# Python
python3 -m http.server 3000 --directory .

# Node
npx serve .
```

## Backend Dependencies

| Service | Port | Language |
|---------|------|----------|
| C Micro-Service | 8090 | C |
| Python REST API | 5050 | Python / Flask |
| Java Spring Boot API | 8080 | Java / Spring Boot |

All three backends must be running for full functionality. The frontend gracefully
degrades when a backend is unavailable, showing appropriate error messages.
