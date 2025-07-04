package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private UUID id;

    private String nome;
    private String email;
    private String telefone;
    private String cpfCnpj;
    private String senha;
    private Boolean ativo = true;
}
