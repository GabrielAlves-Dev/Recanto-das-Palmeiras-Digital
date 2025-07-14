package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "produto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer quantidade;
    private String imagem;
    private Boolean ativo = true;
}