package com.mockgovsim.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // This is, like, for all our API stuff
                        .allowedOrigins("http://localhost:5173", "http://localhost:5176") // Like, only let our cute frontend in
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Like, all the things they're allowed to do
                        .allowedHeaders("*") // Like, they can wear whatever accessories they want
                        .allowCredentials(true);
            }
        };
    }
} 