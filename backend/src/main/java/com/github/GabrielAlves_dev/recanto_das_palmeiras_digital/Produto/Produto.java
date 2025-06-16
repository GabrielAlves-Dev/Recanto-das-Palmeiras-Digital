package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "Produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produto")
    private Integer id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "preco")
    private BigDecimal preco;

    @Column(name = "preco_revenda")
    private BigDecimal precoRevenda;

    @Column(name = "quantidade")
    private Integer quantidade;

    @Column(name = "imagem")
    private String imagem;

    @Column(name = "ativo")
    private Boolean ativo;
}
