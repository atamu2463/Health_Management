package com.example.healthmanagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.util.UUID;

@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "department_id", nullable = false)
    private UUID departmentId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    protected Employee() {}

    public Employee(UUID organizationId, UUID departmentId, String name, String email, String password) {
        this.organizationId = organizationId;
        this.departmentId = departmentId;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }

    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}