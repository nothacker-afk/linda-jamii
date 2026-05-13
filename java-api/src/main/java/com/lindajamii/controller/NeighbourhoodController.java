package com.lindajamii.controller;

import com.lindajamii.model.Neighbourhood;
import com.lindajamii.service.NeighbourhoodService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for neighbourhood management.
 * Base path: /api/neighbourhoods
 */
@RestController
@RequestMapping("/api/neighbourhoods")
@CrossOrigin(origins = "*")
public class NeighbourhoodController {

    private final NeighbourhoodService service;

    public NeighbourhoodController(NeighbourhoodService service) {
        this.service = service;
    }

    /** GET /api/neighbourhoods — list all */
    @GetMapping
    public ResponseEntity<Map<String, Object>> listAll() {
        List<Neighbourhood> list = service.findAll();
        return ResponseEntity.ok(Map.of(
            "total", list.size(),
            "neighbourhoods", list
        ));
    }

    /** GET /api/neighbourhoods/summary — aggregated stats */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary() {
        return ResponseEntity.ok(service.summary());
    }

    /** GET /api/neighbourhoods/{id} — single neighbourhood */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable String id) {
        Optional<Neighbourhood> opt = service.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Neighbourhood not found: " + id));
        }
        return ResponseEntity.ok(opt.get());
    }

    /** POST /api/neighbourhoods — create */
    @PostMapping
    public ResponseEntity<Neighbourhood> create(@RequestBody Neighbourhood n) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(n));
    }

    /** PUT /api/neighbourhoods/{id} — update */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id,
                                    @RequestBody Neighbourhood n) {
        if (service.findById(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Neighbourhood not found: " + id));
        }
        n.setId(id);
        return ResponseEntity.ok(service.save(n));
    }

    /** DELETE /api/neighbourhoods/{id} — delete */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (!service.delete(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Neighbourhood not found: " + id));
        }
        return ResponseEntity.ok(Map.of("deleted", id));
    }
}
