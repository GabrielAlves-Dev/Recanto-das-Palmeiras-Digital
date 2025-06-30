package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.*;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
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
        if (repository.existsByCpfCnpj(dto.getCpfCnpj())) { // Adicionado
            throw new ValidationException("CPF/CNPJ já está em uso");
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

    @Transactional
    public void editar(UUID id, UsuarioUpdateDTO dto) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ValidationException("Usuário não encontrado."));

        // Atualiza os campos se eles foram fornecidos no DTO
        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            usuario.setNome(dto.getNome());
        }
        if (dto.getEmail() != null && !dto.getEmail().isBlank() && !dto.getEmail().equals(usuario.getEmail())) {
            if (repository.existsByEmail(dto.getEmail())) {
                throw new ValidationException("Email já está em uso.");
            }
            usuario.setEmail(dto.getEmail());
        }
        if (dto.getTelefone() != null && !dto.getTelefone().isBlank()) {
            usuario.setTelefone(dto.getTelefone());
        }
        if (dto.getCpfCnpj() != null && !dto.getCpfCnpj().isBlank() && !dto.getCpfCnpj().equals(usuario.getCpfCnpj())) {
            if (repository.existsByCpfCnpj(dto.getCpfCnpj())) {
                throw new ValidationException("CPF/CNPJ já está em uso.");
            }
            usuario.setCpfCnpj(dto.getCpfCnpj());
        }
        if (dto.getCargo() != null && !dto.getCargo().isBlank()) {
            usuario.setCargo(dto.getCargo());
        }
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        }

        repository.save(usuario);
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
