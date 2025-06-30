package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioUpdateDTO {

    private String nome;

    @Email(message = "Email inválido")
    private String email;

    private String telefone;

    private String cpfCnpj;

    private String cargo;

    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    private String senha;
}