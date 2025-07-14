package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.configuration;

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

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.util.SecurityFilter;

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
                // RF001 & RF003: Permitir acesso público para login e autocadastro de cliente
                .requestMatchers(HttpMethod.POST, "/usuarios/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/clientes/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/clientes/auto-cadastro").permitAll()

                // RF004, RF005, RF006: Acesso do cliente aos seus próprios dados
                .requestMatchers(HttpMethod.GET, "/clientes/{id}").hasRole("CLIENTE")
                .requestMatchers(HttpMethod.PUT, "/clientes/{id}").hasRole("CLIENTE")
                .requestMatchers(HttpMethod.PATCH, "/clientes/{id}/desativar").hasRole("CLIENTE")

                // RF007, RF008, RF009: Gestão de produtos pelo gerente
                .requestMatchers(HttpMethod.POST, "/produtos").hasRole("GERENTE")
                .requestMatchers(HttpMethod.PUT, "/produtos/{id}").hasRole("GERENTE")
                .requestMatchers(HttpMethod.PATCH, "/produtos/{id}").hasRole("GERENTE")

                // RF010, RF011, RF012: Visualização de produtos
                .requestMatchers(HttpMethod.GET, "/produtos", "/produtos/{id}").hasAnyRole("GERENTE", "VENDEDOR", "CLIENTE")

                // RF013: Cadastro de cliente por admin
                .requestMatchers(HttpMethod.POST, "/clientes").hasAnyRole("GERENTE", "VENDEDOR")

                // RF014, RF015: Listagem e visualização de clientes por admin
                .requestMatchers(HttpMethod.GET, "/clientes", "/clientes/{id}").hasAnyRole("GERENTE", "VENDEDOR")

                // RF016, RF017: Edição e desativação de clientes por gerente
                .requestMatchers(HttpMethod.PUT, "/clientes/{id}").hasRole("GERENTE")
                .requestMatchers(HttpMethod.PATCH, "/clientes/{id}/desativar").hasRole("GERENTE")

                // RF018, RF019, RF020, RF021, RF022: Gestão de usuários internos pelo gerente
                .requestMatchers("/usuarios/**").hasRole("GERENTE")

                // RF023: Gestão do carrinho de compras pelo cliente
                .requestMatchers("/carrinho/**").hasRole("CLIENTE")

                // RF024: Finalizar pedido pelo cliente
                .requestMatchers(HttpMethod.POST, "/pedidos").hasRole("CLIENTE")

                // RF025: Criação de pedido por admin
                .requestMatchers(HttpMethod.POST, "/pedidos").hasAnyRole("GERENTE", "VENDEDOR")

                // RF026, RF027: Consulta de histórico de pedidos pelo cliente
                .requestMatchers(HttpMethod.GET, "/pedidos", "/pedidos/{id}").hasAnyRole("CLIENTE", "GERENTE", "VENDEDOR")

                // RF028: Gerenciamento de lista de pedidos por admin
                // Removed redundant rule for admin roles

                // RF029: Cancelamento de pedido pelo cliente
                .requestMatchers(HttpMethod.POST, "/pedidos/{id}/cancelar").hasRole("CLIENTE")

                // RF030: Gerenciamento de pedido individual por admin
                .requestMatchers(HttpMethod.PATCH, "/pedidos/{id}/status").hasAnyRole("GERENTE", "VENDEDOR")

                .anyRequest().authenticated()
            )
            .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }
}
