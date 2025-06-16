package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Data
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

    private String descricao;
    private BigDecimal preco;
    private BigDecimal precoRevenda;
    private Integer quantidade;
    private String imagem;
    private Boolean ativo;
}
