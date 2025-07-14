package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Builder
public class PedidoItemResponseDTO {
    private UUID id;
    private String nomeProduto;
    private Integer quantidade;
    private BigDecimal precoUnitario;
    private BigDecimal subtotal;
}