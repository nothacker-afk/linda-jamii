package com.lindajamii.service;

import com.lindajamii.model.Patrol;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory service for patrol scheduling.
 */
@Service
public class PatrolService {

    private final Map<String, Patrol> store = new ConcurrentHashMap<>();

    public PatrolService() {
        store.put("pat-001", new Patrol(
            "pat-001", "Westlands", "Alice Wanjiku",
            Arrays.asList("Brian Otieno", "Carol Muthoni"),
            LocalDateTime.now().plusHours(2),
            "Ring Road → Waiyaki Way → Westlands Ave", "scheduled"
        ));
        store.put("pat-002", new Patrol(
            "pat-002", "Kilimani", "David Kamau",
            Arrays.asList("Eve Njeri", "Frank Mwangi"),
            LocalDateTime.now().minusHours(1),
            "Argwings Kodhek → Lenana Road → Kilimani Road", "active"
        ));
        store.put("pat-003", new Patrol(
            "pat-003", "Karen", "Frank Mwangi",
            Arrays.asList("Alice Wanjiku"),
            LocalDateTime.now().minusDays(1),
            "Karen Road → Ngong Road → Hardy", "completed"
        ));
    }

    public List<Patrol> findAll() {
        return new ArrayList<>(store.values());
    }

    public Optional<Patrol> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<Patrol> findByStatus(String status) {
        List<Patrol> result = new ArrayList<>();
        for (Patrol p : store.values()) {
            if (p.getStatus().equalsIgnoreCase(status)) result.add(p);
        }
        return result;
    }

    public Patrol save(Patrol p) {
        if (p.getId() == null || p.getId().isBlank()) {
            p.setId("pat-" + UUID.randomUUID().toString().substring(0, 6));
        }
        if (p.getScheduledAt() == null) p.setScheduledAt(LocalDateTime.now());
        if (p.getStatus()      == null) p.setStatus("scheduled");
        store.put(p.getId(), p);
        return p;
    }
}
