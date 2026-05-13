package com.lindajamii.service;

import com.lindajamii.model.Neighbourhood;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory service for neighbourhood management.
 */
@Service
public class NeighbourhoodService {

    private final Map<String, Neighbourhood> store = new ConcurrentHashMap<>();

    public NeighbourhoodService() {
        // Seed data
        add(new Neighbourhood("nbh-001", "Westlands",    "Nairobi", "Nairobi", -1.2676, 36.8119, 142, "Alice Wanjiku", true));
        add(new Neighbourhood("nbh-002", "Kilimani",     "Nairobi", "Nairobi", -1.2890, 36.7870, 98,  "Brian Otieno",  true));
        add(new Neighbourhood("nbh-003", "Parklands",    "Nairobi", "Nairobi", -1.2618, 36.8220, 75,  "Carol Muthoni", true));
        add(new Neighbourhood("nbh-004", "Ngong Road",   "Nairobi", "Nairobi", -1.3001, 36.7820, 53,  "David Kamau",   true));
        add(new Neighbourhood("nbh-005", "Lavington",    "Nairobi", "Nairobi", -1.2800, 36.7760, 61,  "Eve Njeri",     true));
        add(new Neighbourhood("nbh-006", "Karen",        "Nairobi", "Nairobi", -1.3270, 36.7140, 88,  "Frank Mwangi",  true));
    }

    private void add(Neighbourhood n) {
        store.put(n.getId(), n);
    }

    public List<Neighbourhood> findAll() {
        return new ArrayList<>(store.values());
    }

    public Optional<Neighbourhood> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public Neighbourhood save(Neighbourhood n) {
        if (n.getId() == null || n.getId().isBlank()) {
            n.setId("nbh-" + UUID.randomUUID().toString().substring(0, 6));
        }
        store.put(n.getId(), n);
        return n;
    }

    public boolean delete(String id) {
        return store.remove(id) != null;
    }

    public Map<String, Object> summary() {
        List<Neighbourhood> all = findAll();
        int total   = all.size();
        int active  = (int) all.stream().filter(Neighbourhood::isActive).count();
        int members = all.stream().mapToInt(Neighbourhood::getMemberCount).sum();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("total_neighbourhoods", total);
        map.put("active_neighbourhoods", active);
        map.put("total_members", members);
        return map;
    }
}
