package com.lindajamii.model;

import java.time.LocalDateTime;

/**
 * Represents a registered neighbourhood in the LindaJamii platform.
 */
public class Neighbourhood {

    private String id;
    private String name;
    private String county;
    private String city;
    private double latitude;
    private double longitude;
    private int memberCount;
    private String wardLeader;
    private LocalDateTime registeredAt;
    private boolean active;

    public Neighbourhood() {}

    public Neighbourhood(String id, String name, String county, String city,
                         double latitude, double longitude,
                         int memberCount, String wardLeader, boolean active) {
        this.id          = id;
        this.name        = name;
        this.county      = county;
        this.city        = city;
        this.latitude    = latitude;
        this.longitude   = longitude;
        this.memberCount = memberCount;
        this.wardLeader  = wardLeader;
        this.active      = active;
        this.registeredAt = LocalDateTime.now();
    }

    // ── Getters & Setters ────────────────────────────────────────────
    public String getId()                      { return id; }
    public void   setId(String id)             { this.id = id; }

    public String getName()                    { return name; }
    public void   setName(String name)         { this.name = name; }

    public String getCounty()                  { return county; }
    public void   setCounty(String county)     { this.county = county; }

    public String getCity()                    { return city; }
    public void   setCity(String city)         { this.city = city; }

    public double getLatitude()                { return latitude; }
    public void   setLatitude(double lat)      { this.latitude = lat; }

    public double getLongitude()               { return longitude; }
    public void   setLongitude(double lng)     { this.longitude = lng; }

    public int    getMemberCount()             { return memberCount; }
    public void   setMemberCount(int count)    { this.memberCount = count; }

    public String getWardLeader()              { return wardLeader; }
    public void   setWardLeader(String leader) { this.wardLeader = leader; }

    public LocalDateTime getRegisteredAt()     { return registeredAt; }
    public void setRegisteredAt(LocalDateTime dt) { this.registeredAt = dt; }

    public boolean isActive()                  { return active; }
    public void    setActive(boolean active)   { this.active = active; }
}
