package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.endereco.EnderecoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.stream.Collectors;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.ClienteResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.UsuarioResponseDTO;

@Component
public class PedidoMapper {

    @Autowired
    private EnderecoMapper enderecoMapper;

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
                .cliente(pedido.getCliente() != null ? ClienteResponseDTO.builder().nome(pedido.getCliente().getNome()).email(pedido.getCliente().getEmail()).telefone(pedido.getCliente().getTelefone()).build() : ClienteResponseDTO.builder().nome("Venda Balcão").build())
                .vendedor(pedido.getUsuario() != null ? UsuarioResponseDTO.builder().nome(pedido.getUsuario().getNome()).build() : UsuarioResponseDTO.builder().nome("Venda Online").build())
                .endereco(enderecoMapper.toDTO(pedido.getEndereco()))
                .itens(pedido.getItens().stream().map(this::toPedidoItemResponseDTO).collect(Collectors.toList()))
                .dataPedido(pedido.getDataPedido())
                .status(pedido.getStatus())
                .valorTotal(pedido.getValorTotal())
                .formaPagamento(pedido.getFormaPagamento())
                .observacoes(pedido.getObservacoes())
                .build();
    }
}