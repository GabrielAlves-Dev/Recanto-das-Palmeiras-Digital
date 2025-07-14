package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.configuration;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.util.SecurityFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // ENDPOINTS PÚBLICOS
                        .requestMatchers(HttpMethod.POST, "/usuarios/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/clientes/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/clientes/auto-cadastro").permitAll()
                        .requestMatchers(HttpMethod.GET, "/produtos", "/produtos/{id}").permitAll()
                        .requestMatchers("/uploads/**").permitAll()

                        // ENDPOINTS DE PRODUTOS (ADMIN)
                        .requestMatchers(HttpMethod.POST, "/produtos").hasRole("GERENTE")
                        .requestMatchers(HttpMethod.PUT, "/produtos/{id}").hasRole("GERENTE")
                        .requestMatchers(HttpMethod.PATCH, "/produtos/{id}").hasRole("GERENTE")

                        // ENDPOINTS DE USUÁRIOS (ADMIN INTERNO - APENAS GERENTE)
                        .requestMatchers(HttpMethod.GET, "/usuarios", "/usuarios/{id}").hasRole("GERENTE")
                        .requestMatchers(HttpMethod.POST, "/usuarios").hasRole("GERENTE")
                        .requestMatchers(HttpMethod.PUT, "/usuarios/{id}").hasRole("GERENTE")
                        .requestMatchers(HttpMethod.PATCH, "/usuarios/{id}/**").hasRole("GERENTE")

                        // ENDPOINTS DE CLIENTES (REGRAS CONSOLIDADAS)
                        .requestMatchers(HttpMethod.GET, "/clientes").hasAnyRole("GERENTE", "VENDEDOR")
                        .requestMatchers(HttpMethod.GET, "/clientes/{id}").hasAnyRole("CLIENTE", "GERENTE", "VENDEDOR")
                        .requestMatchers(HttpMethod.POST, "/clientes").hasAnyRole("GERENTE", "VENDEDOR")
                        .requestMatchers(HttpMethod.PUT, "/clientes/{id}").hasAnyRole("CLIENTE", "GERENTE")
                        .requestMatchers(HttpMethod.PATCH, "/clientes/{id}/ativar").hasRole("GERENTE")
                        .requestMatchers(HttpMethod.PATCH, "/clientes/{id}/desativar").hasAnyRole("CLIENTE", "GERENTE")

                        // ENDPOINTS DE CARRINHO (APENAS CLIENTE)
                        .requestMatchers("/carrinho/**").hasRole("CLIENTE")

                        // ENDPOINTS DE PEDIDOS
                        .requestMatchers(HttpMethod.POST, "/pedidos").hasAnyRole("CLIENTE", "GERENTE", "VENDEDOR")
                        .requestMatchers(HttpMethod.GET, "/pedidos", "/pedidos/{id}").hasAnyRole("CLIENTE", "GERENTE", "VENDEDOR")
                        .requestMatchers(HttpMethod.POST, "/pedidos/{id}/cancelar").hasAnyRole("CLIENTE", "GERENTE", "VENDEDOR")
                        .requestMatchers(HttpMethod.PATCH, "/pedidos/{id}/status").hasAnyRole("GERENTE", "VENDEDOR")

                        // Qualquer outra requisição precisa estar autenticado
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}