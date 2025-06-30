package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Integer id;

    private String nome;
    private String email;
    private String telefone;
    private String cpfCnpj;
    private String senha;
    private String cargo;
    private Boolean ativo;
}
