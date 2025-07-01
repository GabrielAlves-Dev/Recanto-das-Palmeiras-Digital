package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioRequestDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "CPF/CNPJ é obrigatório")
    @Pattern(regexp = "^([0-9]{11}|[0-9]{14})$", message = "CPF/CNPJ inválido. Deve conter apenas números, 11 para CPF ou 14 para CNPJ.")
    private String cpfCnpj;

    @NotBlank(message = "Cargo é obrigatório")
    private String cargo;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    private String senha;
}