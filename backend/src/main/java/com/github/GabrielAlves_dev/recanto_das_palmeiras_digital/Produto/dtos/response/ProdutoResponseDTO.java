package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto.dtos.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProdutoResponseDTO {
    private Integer id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer quantidade;
    private String imagem;
    private Boolean ativo;
}
