package com.lindajamii.model;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a scheduled neighbourhood patrol.
 */
public class Patrol {

    private String id;
    private String neighbourhood;
    private String leader;
    private List<String> members;
    private LocalDateTime scheduledAt;
    private String route;
    private String status; // scheduled | active | completed | cancelled
    private String notes;

    public Patrol() {}

    public Patrol(String id, String neighbourhood, String leader,
                  List<String> members, LocalDateTime scheduledAt,
                  String route, String status) {
        this.id            = id;
        this.neighbourhood = neighbourhood;
        this.leader        = leader;
        this.members       = members;
        this.scheduledAt   = scheduledAt;
        this.route         = route;
        this.status        = status;
    }

    // ── Getters & Setters ────────────────────────────────────────────
    public String getId()                       { return id; }
    public void   setId(String id)              { this.id = id; }

    public String getNeighbourhood()            { return neighbourhood; }
    public void   setNeighbourhood(String n)    { this.neighbourhood = n; }

    public String getLeader()                   { return leader; }
    public void   setLeader(String leader)      { this.leader = leader; }

    public List<String> getMembers()            { return members; }
    public void setMembers(List<String> members){ this.members = members; }

    public LocalDateTime getScheduledAt()       { return scheduledAt; }
    public void setScheduledAt(LocalDateTime dt){ this.scheduledAt = dt; }

    public String getRoute()                    { return route; }
    public void   setRoute(String route)        { this.route = route; }

    public String getStatus()                   { return status; }
    public void   setStatus(String status)      { this.status = status; }

    public String getNotes()                    { return notes; }
    public void   setNotes(String notes)        { this.notes = notes; }
}
