package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "usuario")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private UUID id;

    private String nome;
    private String email;
    private String cpfCnpj;
    private String cargo;
    private String senha;
    private Boolean ativo;
}
