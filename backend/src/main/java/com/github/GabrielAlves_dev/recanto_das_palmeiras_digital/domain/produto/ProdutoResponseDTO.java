package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoResponseDTO {

    private UUID id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer quantidade;
    private String imagem;
    private Boolean ativo;
}
