# LindaJamii — C Service

A lightweight HTTP micro-service written in pure C (no external dependencies).  
It runs on **port 8090** and exposes low-level utility endpoints consumed by the Python and Java layers.

## Build & Run

```bash
make          # compile
make run      # compile + start
make clean    # remove binary
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | JSON health-check |
| GET | `/info` | Service & project metadata |
| GET | `/hash?text=hello` | DJB2 hash of the given text |
| GET | `/stats` | Uptime (seconds) + total requests served |

## Example

```bash
curl http://localhost:8090/health
# {"status":"ok","service":"LindaJamii C Service","version":"1.0.0","language":"C"}

curl "http://localhost:8090/hash?text=LindaJamii"
# {"input":"LindaJamii","djb2_hash":2887652871,"hex":"0xAC3E4DC7"}
```
