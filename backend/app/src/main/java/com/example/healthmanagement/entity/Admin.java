package com.example.healthmanagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.util.UUID;

@Entity
@Table(name = "admins")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "department_id", nullable = false)
    private UUID departmentId;
    
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;
    
    protected Admin() {}

    public Admin(UUID organizationId, UUID departmentId, String email, String password) {
        this.organizationId = organizationId;
        this.departmentId = departmentId;
        this.email = email;
        this.password = password;
    }

    public UUID getId() { return id; }
    public UUID getOrganizationId() { return organizationId; }
    public UUID getDepartmentId() { return departmentId; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }

    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}