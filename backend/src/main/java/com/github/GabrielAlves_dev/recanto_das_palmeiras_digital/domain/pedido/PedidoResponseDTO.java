package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.ClienteResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.UsuarioResponseDTO;
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
    private ClienteResponseDTO cliente;
    private UsuarioResponseDTO vendedor;
    private List<PedidoItemResponseDTO> itens;
    private ZonedDateTime dataPedido;
    private StatusPedido status;
    private BigDecimal valorTotal;
    private String formaPagamento;
    private String observacoes;
}
