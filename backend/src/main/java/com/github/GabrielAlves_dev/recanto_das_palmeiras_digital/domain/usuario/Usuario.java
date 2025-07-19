package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "usuario")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    private String nome;
    private String email;
    @Enumerated(EnumType.STRING)
    private CargoUsuario cargo;
    private String senha;
    private Boolean ativo;

    public Usuario(String email, String senha, CargoUsuario cargo){
        this.email = email;
        this.senha = senha;
        this.cargo = cargo;
        //this.ativo = true;
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.cargo == CargoUsuario.GERENTE) return List.of(new SimpleGrantedAuthority("ROLE_GERENTE"), new SimpleGrantedAuthority("ROLE_VENDEDOR"));
        else return List.of(new SimpleGrantedAuthority("ROLE_VENDEDOR"));
    }
    @Override
    public String getPassword() {
        return this.senha;
    }
    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.ativo;
    }
}
