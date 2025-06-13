package com.mockgovsim.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.time.LocalDate;

@Entity
@Data
@EqualsAndHashCode(exclude = "user")
@ToString(exclude = "user")
public class UserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleType type;

    @Column
    private String regionId; // e.g., "USA", "USA-CA", "USA-CA-06"

    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;

} 
