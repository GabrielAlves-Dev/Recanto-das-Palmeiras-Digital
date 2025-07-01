package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto;

import org.springframework.stereotype.Component;

@Component
public class ProdutoMapper {

    public ProdutoResponseDTO toProdutoResponseDTO(Produto produto) {
        if (produto == null) return null;

        return ProdutoResponseDTO.builder()
                .id(produto.getId())
                .nome(produto.getNome())
                .descricao(produto.getDescricao())
                .preco(produto.getPreco())
                .quantidade(produto.getQuantidade())
                .imagem(produto.getImagem() != null ? "/uploads/" + produto.getImagem() : null)
                .ativo(produto.getAtivo())
                .build();
    }

    public Produto toProduto(ProdutoRequestDTO dto) {
        if (dto == null) return null;

        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setQuantidade(dto.getQuantidade());
        return produto;
    }
}
