package com.mockgovsim.util;

import com.mockgovsim.domain.User;
import com.mockgovsim.model.news.Article;
import com.mockgovsim.model.news.ArticleStatus;
import com.mockgovsim.model.news.EditorialStance;
import com.mockgovsim.model.news.NewsAgency;
import com.mockgovsim.repository.UserRepository;
import com.mockgovsim.repository.news.ArticleRepository;
import com.mockgovsim.repository.news.NewsAgencyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final NewsAgencyRepository newsAgencyRepository;
    private final ArticleRepository articleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, NewsAgencyRepository newsAgencyRepository, ArticleRepository articleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.newsAgencyRepository = newsAgencyRepository;
        this.articleRepository = articleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (newsAgencyRepository.count() == 0) {
            System.out.println("Seeding database with initial data...");

            // 1. Create or find a default user
            User defaultUser = userRepository.findByUsername("news_editor")
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername("news_editor");
                    newUser.setEmail("editor@mockgovsim.com");
                    newUser.setPassword(passwordEncoder.encode("password"));
                    newUser.setEnabled(true);
                    return userRepository.save(newUser);
                });

            // 2. Create News Agencies
            NewsAgency agency1 = new NewsAgency();
            agency1.setName("The Civic Tribune");
            agency1.setSlogan("For the People.");
            agency1.setFounder(defaultUser);
            agency1.setEditorialStance(EditorialStance.CENTER);
            newsAgencyRepository.save(agency1);

            NewsAgency agency2 = new NewsAgency();
            agency2.setName("The Liberty Ledger");
            agency2.setSlogan("Freedom First.");
            agency2.setFounder(defaultUser);
            agency2.setEditorialStance(EditorialStance.RIGHT_WING);
            newsAgencyRepository.save(agency2);
            
            NewsAgency agency3 = new NewsAgency();
            agency3.setName("The Progressive Post");
            agency3.setSlogan("Forward Together.");
            agency3.setFounder(defaultUser);
            agency3.setEditorialStance(EditorialStance.LEFT_WING);
            newsAgencyRepository.save(agency3);

            // 3. Create Articles
            createArticle(
                "Election Heats Up as Front-Runners Emerge",
                "The presidential race is entering a critical phase as two clear front-runners have emerged from the primaries. Polls indicate a tight race ahead.",
                "Politics, Election 2025",
                agency1, defaultUser
            );
             createArticle(
                "New Economic Data Shows Unexpected Growth",
                "The latest quarterly report from the Bureau of Economic Analysis reveals a surprising uptick in GDP, defying analysts' predictions of a slowdown.",
                "Economy, Finance",
                agency2, defaultUser
            );
            createArticle(
                "Healthcare Reform Bill Faces Stiff Opposition in Congress",
                "A landmark healthcare reform bill is currently being debated in Congress, but faces significant opposition from across the aisle. Protests have erupted in major cities.",
                "Politics, Healthcare",
                agency3, defaultUser
            );
             createArticle(
                "International Summit Addresses Global Climate Crisis",
                "Leaders from around the world have gathered for a high-stakes summit to negotiate new international agreements on climate change.",
                "World, Climate",
                agency1, defaultUser
            );
            createArticle(
                "Debate Over Tech Regulation Intensifies",
                "Legislators are considering new regulations on major tech companies, sparking a fierce debate about innovation, privacy, and censorship.",
                "Technology, Politics",
                agency2, defaultUser
            );
            createArticle(
                "Social Justice Movement Gains Momentum",
                "A series of high-profile events has fueled a growing social justice movement, with calls for widespread police and criminal justice reform.",
                "Social, Justice",
                agency3, defaultUser
            );

            System.out.println("Database seeding complete.");
        }
    }

    private void createArticle(String headline, String body, String tags, NewsAgency agency, User author) {
        Article article = new Article();
        article.setHeadline(headline);
        article.setBody(body);
        article.setTags(tags);
        article.setNewsAgency(agency);
        article.setAuthor(author);
        article.setStatus(ArticleStatus.PUBLISHED);
        article.setPublishedAt(LocalDateTime.now().minusDays((long)(Math.random() * 5)));
        articleRepository.save(article);
    }
} 