package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto.dtos;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto.Produto;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Util.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProdutoMapper {

    @Autowired
    StorageService storageService;

    public Produto toEntity(ProdutoRequestDTO dto) {
        Produto entity = new Produto();

        entity.setId(dto.getId());
        entity.setNome(dto.getNome());
        entity.setDescricao(dto.getDescricao());
        entity.setPreco(dto.getPreco());
        entity.setQuantidade(dto.getQuantidade());
        entity.setAtivo(true);

        if (dto.getImagem() != null && !dto.getImagem().isEmpty()) {
            String caminhoImagem = storageService.salvarImagem(dto.getImagem()); // Salva a imagem em si
            entity.setImagem(caminhoImagem); // Salva o caminho no banco
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
