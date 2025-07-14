package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class PedidoResponseDTO {
    private UUID id;
    private String nomeCliente;
    private String nomeVendedor;
    private List<PedidoItemResponseDTO> itens;
    private ZonedDateTime dataPedido;
    private StatusPedido status;
    private BigDecimal valorTotal;
    private String formaPagamento;
    private String observacoes;
}