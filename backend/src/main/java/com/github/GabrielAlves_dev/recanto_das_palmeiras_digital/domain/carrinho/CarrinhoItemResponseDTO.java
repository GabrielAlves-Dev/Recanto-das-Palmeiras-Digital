package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.carrinho;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Builder
public class CarrinhoItemResponseDTO {
    private UUID produtoId;
    private String nomeProduto;
    private String imagemUrl;
    private Integer quantidade;
    private BigDecimal precoUnitario;
    private BigDecimal subtotal;
}
