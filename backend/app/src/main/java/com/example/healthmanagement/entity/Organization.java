package com.example.healthmanagement.entity;

import jakarta.persistence.*;
import Lombok.*;
import java.util.UUID;

@Entity
@Table(name = "organizations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;
}
    
    
