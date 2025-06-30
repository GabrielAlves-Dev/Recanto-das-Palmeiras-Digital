package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario;

import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {
    public Usuario toUsuario(UsuarioRequestDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setTelefone(dto.getTelefone());
        usuario.setCpfCnpj(dto.getCpfCnpj());
        usuario.setCargo(dto.getCargo());
        return usuario;
    }

    public UsuarioResponseDTO toUsuarioResponseDTO(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .telefone(usuario.getTelefone())
                .cpfCnpj(usuario.getCpfCnpj())
                .cargo(usuario.getCargo())
                .ativo(usuario.getAtivo())
                .build();
    }
}