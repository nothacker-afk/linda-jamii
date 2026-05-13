package com.lindajamii.controller;

import com.lindajamii.model.Patrol;
import com.lindajamii.service.PatrolService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for patrol scheduling.
 * Base path: /api/patrols
 */
@RestController
@RequestMapping("/api/patrols")
@CrossOrigin(origins = "*")
public class PatrolController {

    private final PatrolService service;

    public PatrolController(PatrolService service) {
        this.service = service;
    }

    /** GET /api/patrols — list all (optionally filtered by ?status=) */
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'WARDEN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> listAll(
            @RequestParam(required = false) String status) {
        List<Patrol> list = (status != null && !status.isBlank())
            ? service.findByStatus(status)
            : service.findAll();
        return ResponseEntity.ok(Map.of("total", list.size(), "patrols", list));
    }

    /** GET /api/patrols/{id} — single patrol */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable String id) {
        Optional<Patrol> opt = service.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Patrol not found: " + id));
        }
        return ResponseEntity.ok(opt.get());
    }

    /** POST /api/patrols — schedule a new patrol */
    @PostMapping
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    public ResponseEntity<Patrol> create(@RequestBody Patrol p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(p));
    }
}
