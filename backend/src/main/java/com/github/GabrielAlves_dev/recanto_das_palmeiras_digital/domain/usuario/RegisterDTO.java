package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDTO {
    String email;
    String senha;
    CargoUsuario cargo;    
}
