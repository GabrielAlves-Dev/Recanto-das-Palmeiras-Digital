package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.Usuario;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.UsuarioMapper;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.UsuarioRequestDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.UsuarioResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.UsuarioRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private UsuarioMapper mapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UUID cadastrar(UsuarioRequestDTO dto) {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new ValidationException("Email já está em uso");
        }

        Usuario usuario = mapper.toUsuario(dto);
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setAtivo(true);

        return repository.save(usuario).getId();
    }

    public UsuarioResponseDTO buscarPorId(UUID id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        return mapper.toUsuarioResponseDTO(usuario);
    }

    public Page<UsuarioResponseDTO> listar(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toUsuarioResponseDTO);
    }

    public void alterarStatus(UUID id, boolean ativo) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        usuario.setAtivo(ativo);
        repository.save(usuario);
    }

    public void excluir(UUID id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Usuário não encontrado");
        }
        repository.deleteById(id);
    }
}
