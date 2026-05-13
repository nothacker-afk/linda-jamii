package com.lindajamii.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Health-check and root info controller.
 */
@RestController
@CrossOrigin(origins = "*")
public class HealthController {

    private static final Instant START = Instant.now();

    /** GET /api/health */
    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> health() {
        long uptime = Instant.now().getEpochSecond() - START.getEpochSecond();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status",          "ok");
        body.put("service",         "LindaJamii Java API");
        body.put("version",         "1.0.0");
        body.put("language",        "Java");
        body.put("java_version",    System.getProperty("java.version"));
        body.put("uptime_seconds",  uptime);
        return ResponseEntity.ok(body);
    }

    /** GET /api */
    @GetMapping("/api")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("name",        "LindaJamii Java API");
        body.put("description", "Neighbourhood management & patrol scheduling");
        body.put("endpoints",   new String[]{
            "/api/health",
            "/api/neighbourhoods",
            "/api/neighbourhoods/summary",
            "/api/patrols",
        });
        return ResponseEntity.ok(body);
    }
}
