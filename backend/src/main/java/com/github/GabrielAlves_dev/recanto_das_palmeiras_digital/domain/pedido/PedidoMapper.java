package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.stream.Collectors;

@Component
public class PedidoMapper {

    public PedidoItemResponseDTO toPedidoItemResponseDTO(PedidoItem item) {
        return PedidoItemResponseDTO.builder()
                .id(item.getId())
                .nomeProduto(item.getProduto().getNome())
                .quantidade(item.getQuantidade())
                .precoUnitario(item.getPrecoUnitario())
                .subtotal(item.getPrecoUnitario().multiply(new BigDecimal(item.getQuantidade())))
                .build();
    }

    public PedidoResponseDTO toPedidoResponseDTO(Pedido pedido) {
        return PedidoResponseDTO.builder()
                .id(pedido.getId())
                .nomeCliente(pedido.getCliente() != null ? pedido.getCliente().getNome() : "Venda Balcão")
                .nomeVendedor(pedido.getUsuario() != null ? pedido.getUsuario().getNome() : "Venda Online")
                .itens(pedido.getItens().stream().map(this::toPedidoItemResponseDTO).collect(Collectors.toList()))
                .dataPedido(pedido.getDataPedido())
                .status(pedido.getStatus())
                .valorTotal(pedido.getValorTotal())
                .formaPagamento(pedido.getFormaPagamento())
                .observacoes(pedido.getObservacoes())
                .build();
    }
}