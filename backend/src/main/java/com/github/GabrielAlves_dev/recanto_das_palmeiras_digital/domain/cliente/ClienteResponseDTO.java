package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteResponseDTO {
    private UUID id;
    private String nome;
    private String email;
    private String telefone;
    private String cpfCnpj;
    private Boolean ativo;
}
