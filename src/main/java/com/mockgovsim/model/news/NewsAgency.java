package com.mockgovsim.model.news;

import com.mockgovsim.domain.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.List;

@Entity
@Data
public class NewsAgency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String logoUrl;

    private String slogan;

    @Enumerated(EnumType.STRING)
    private EditorialStance editorialStance;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "founder_id", nullable = false)
    private User founder;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "news_agency_staff",
        joinColumns = @JoinColumn(name = "news_agency_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> staff = new HashSet<>();

    @OneToMany(mappedBy = "newsAgency", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Article> articles;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 