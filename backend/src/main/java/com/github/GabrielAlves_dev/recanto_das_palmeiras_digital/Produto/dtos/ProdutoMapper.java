package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto.dtos;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto.Produto;
import org.springframework.stereotype.Component;

@Component
public class ProdutoMapper {

    public Produto toEntity(ProdutoRequestDTO dto) {
        Produto entity = new Produto();

        entity.setId(dto.getId());
        entity.setNome(dto.getNome());
        entity.setDescricao(dto.getDescricao());
        entity.setPreco(dto.getPreco());
        entity.setQuantidade(dto.getQuantidade());
        entity.setAtivo(true);

        if(dto.getImagem() != null) {
            entity.setImagem(dto.getImagem());
        }

        return entity;
    }

    public ProdutoResponseDTO toProdutoResponseDTO(Produto produto) {
        ProdutoResponseDTO dto = new ProdutoResponseDTO();

        dto.setNome(produto.getNome());
        dto.setId(produto.getId());
        dto.setDescricao(produto.getDescricao());
        dto.setPreco(produto.getPreco());
        dto.setQuantidade(produto.getQuantidade());
        dto.setAtivo(produto.getAtivo());

        if (produto.getImagem() != null) {
            dto.setImagem(produto.getImagem());
        }

        return dto;
    }
}
