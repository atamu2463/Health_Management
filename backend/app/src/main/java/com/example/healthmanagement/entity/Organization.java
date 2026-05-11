package com.example.healthmanagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.util.UUID;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    protected Organization() {}

    public Organization(String name) {
        this.name = name;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

}
    
    
