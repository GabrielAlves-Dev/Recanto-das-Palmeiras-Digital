package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProdutoRequestDTO {

    private Integer id;

    @NotBlank(message = "O nome não pode estar em branco!")
    @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
    private String nome;

    @NotBlank(message = "A descrição não pode estar em branco!")
    private String descricao;

    @NotNull(message = "O preço não pode estar em branco!")
    private BigDecimal preco;

    @NotNull(message = "A quantidade não pode estar em branco!")
    private Integer quantidade;

    private String imagem;
}
