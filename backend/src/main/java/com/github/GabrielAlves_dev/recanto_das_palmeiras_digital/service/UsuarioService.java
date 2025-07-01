package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.*;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.UsuarioRepository;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.util.CpfCnpjUtils;
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
        String cleanedCpfCnpj = CpfCnpjUtils.clean(dto.getCpfCnpj());
        String formattedCpfCnpj = CpfCnpjUtils.format(cleanedCpfCnpj);

        if (repository.existsByEmail(dto.getEmail())) {
            throw new ValidationException("Email já está em uso");
        }
        if (repository.existsByCpfCnpj(formattedCpfCnpj)) {
            throw new ValidationException("CPF/CNPJ já está em uso");
        }

        Usuario usuario = mapper.toUsuario(dto);
        usuario.setCpfCnpj(formattedCpfCnpj);
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

        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            usuario.setNome(dto.getNome());
        }
        if (dto.getEmail() != null && !dto.getEmail().isBlank() && !dto.getEmail().equals(usuario.getEmail())) {
            if (repository.existsByEmail(dto.getEmail())) {
                throw new ValidationException("Email já está em uso.");
            }
            usuario.setEmail(dto.getEmail());
        }
        if (dto.getCpfCnpj() != null && !dto.getCpfCnpj().isBlank()) {
            String cleanedCpfCnpj = CpfCnpjUtils.clean(dto.getCpfCnpj());
            String formattedCpfCnpj = CpfCnpjUtils.format(cleanedCpfCnpj);
            if (!formattedCpfCnpj.equals(usuario.getCpfCnpj()) && repository.existsByCpfCnpj(formattedCpfCnpj)) {
                throw new ValidationException("CPF/CNPJ já está em uso.");
            }
            usuario.setCpfCnpj(formattedCpfCnpj);
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
}