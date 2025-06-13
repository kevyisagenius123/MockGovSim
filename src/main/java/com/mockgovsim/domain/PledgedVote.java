package com.mockgovsim.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pledged_votes")
public class PledgedVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VoteOption voteOption;

    public PledgedVote(User user, Bill bill, VoteOption voteOption) {
        this.user = user;
        this.bill = bill;
        this.voteOption = voteOption;
    }
} 