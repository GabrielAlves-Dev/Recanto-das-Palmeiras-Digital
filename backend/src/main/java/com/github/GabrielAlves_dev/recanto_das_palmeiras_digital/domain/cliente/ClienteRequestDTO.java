package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteRequestDTO {
    private String nome;
    private String cpfCnpj;
    private String telefone;
    private String email;
    private String senha;
}
