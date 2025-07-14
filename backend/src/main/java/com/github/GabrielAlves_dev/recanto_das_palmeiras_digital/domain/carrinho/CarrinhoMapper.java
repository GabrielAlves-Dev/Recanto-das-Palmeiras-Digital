package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.carrinho;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.Produto;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class CarrinhoMapper {

    public CarrinhoItemResponseDTO toResponseDTO(CarrinhoItem item) {
        Produto produto = item.getProduto();
        return CarrinhoItemResponseDTO.builder()
                .produtoId(produto.getId())
                .nomeProduto(produto.getNome())
                .imagemUrl(produto.getImagem() != null ? "/uploads/" + produto.getImagem() : null)
                .quantidade(item.getQuantidade())
                .precoUnitario(produto.getPreco())
                .subtotal(produto.getPreco().multiply(new BigDecimal(item.getQuantidade())))
                .build();
    }
}