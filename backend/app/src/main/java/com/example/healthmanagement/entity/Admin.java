package com.example.healthmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "admins")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Admin {
    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(name = "department_id", nullable = false)
    @UuidGenerator
    private UUID departmentId;
    
    @Column(name = "email", nullable = false, unique = true)
    @Setter
    private String email;

    @Column(name = "password", nullable = false)
    @Setter
    private String password;
}