package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Getter
@Setter
public class ProdutoRequestDTO {

    private Integer id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer quantidade;
    private MultipartFile imagem;
}
