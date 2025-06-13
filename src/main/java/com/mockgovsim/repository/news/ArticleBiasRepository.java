package com.mockgovsim.repository.news;

import com.mockgovsim.model.news.ArticleBias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleBiasRepository extends JpaRepository<ArticleBias, Long> {
} 