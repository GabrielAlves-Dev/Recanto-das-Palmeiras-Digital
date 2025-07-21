package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.endereco;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnderecoDTO {
    @NotBlank(message = "Rua é obrigatória")
    private String rua;
    @NotBlank(message = "Número é obrigatório")
    private String numero;
    private String complemento;
    @NotBlank(message = "Bairro é obrigatório")
    private String bairro;
    @NotBlank(message = "Cidade é obrigatória")
    private String cidade;
    @NotBlank(message = "UF é obrigatório")
    private String uf;
    @NotBlank(message = "CEP é obrigatório")
    private String cep;
}
