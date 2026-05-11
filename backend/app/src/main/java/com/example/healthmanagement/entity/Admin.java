package com.example.healthmanagement.entity;

import jakarta.persistence.*;
import Lombok.*;
import java.util.UUID;

@Entity
@Table(name = "admins")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "department_id", nullable = false)
    private UUID departmentId;
    
    @Column(name = "email", nullable = false, unique = true)
    @Setter
    private String email;

    @Column(name = "password", nullable = false)
    @Setter
    private String password;
}