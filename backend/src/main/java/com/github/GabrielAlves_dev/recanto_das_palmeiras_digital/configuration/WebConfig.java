package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadDir = Paths.get("uploads").toFile().getAbsolutePath();
        
        // Expõe 'uploads' dir via '/uploads/**' URL
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/" + uploadDir + "/");
    }
}
