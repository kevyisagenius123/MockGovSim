package com.mockgovsim.repository.news;

import com.mockgovsim.model.news.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c WHERE c.article.id = :articleId AND c.parentComment IS NULL ORDER BY c.createdAt DESC")
    List<Comment> findByArticleIdAndParentCommentIsNull(Long articleId);
} 