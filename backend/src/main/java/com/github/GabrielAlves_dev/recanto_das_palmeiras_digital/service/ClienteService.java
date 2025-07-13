package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.*;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.AuthenticationDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.LoginResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.ClienteRepository;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.exceptions.ValidationException;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.util.CpfCnpjUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    @Autowired
    private ClienteMapper mapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    public UUID autoCadastrar(ClienteAutoCadastroDTO dto) {
        String cleanedCpfCnpj = CpfCnpjUtils.clean(dto.getCpfCnpj());
        String formattedCpfCnpj = CpfCnpjUtils.format(cleanedCpfCnpj);
        
        Optional<Cliente> existente = repository.findByEmail(dto.getEmail());

        if (existente.isPresent()) {
            if (existente.get().getAtivo()) {
                throw new ValidationException("Email já cadastrado. Faça login.");
            } else {
                throw new ValidationException("Conta desativada. Enviamos um link para reativação.");
            }
        }

        if (repository.existsByCpfCnpj(formattedCpfCnpj)) {
            throw new ValidationException("CPF/CNPJ já cadastrado.");
        }

        Cliente novo = new Cliente();
        novo.setNome(dto.getNome());
        novo.setCpfCnpj(formattedCpfCnpj);
        novo.setTelefone(dto.getTelefone());
        novo.setEmail(dto.getEmail());
        novo.setSenha(passwordEncoder.encode(dto.getSenha()));
        novo.setAtivo(true);

        return repository.save(novo).getId();
    }

    public UUID cadastrarPorGerente(ClienteRequestDTO dto) {
        String cleanedCpfCnpj = CpfCnpjUtils.clean(dto.getCpfCnpj());
        String formattedCpfCnpj = CpfCnpjUtils.format(cleanedCpfCnpj);

        if (repository.existsByEmail(dto.getEmail())) {
            throw new ValidationException("Email já cadastrado.");
        }
        if (repository.existsByCpfCnpj(formattedCpfCnpj)) {
            throw new ValidationException("CPF/CNPJ já cadastrado.");
        }

        Cliente cliente = mapper.toCliente(dto);
        cliente.setCpfCnpj(formattedCpfCnpj);
        cliente.setSenha(passwordEncoder.encode(dto.getSenha()));
        cliente.setAtivo(true);

        return repository.save(cliente).getId();
    }

    public ClienteResponseDTO buscarPorId(UUID id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new ValidationException("Cliente não encontrado."));
        return mapper.toResponseDTO(cliente);
    }

    @Transactional
    public void editar(UUID id, ClienteRequestDTO dto) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new ValidationException("Cliente não encontrado."));

        if (dto.getNome() != null) cliente.setNome(dto.getNome());
        if (dto.getCpfCnpj() != null && !dto.getCpfCnpj().isBlank()) {
            String cleanedCpfCnpj = CpfCnpjUtils.clean(dto.getCpfCnpj());
            String formattedCpfCnpj = CpfCnpjUtils.format(cleanedCpfCnpj);
            if (!formattedCpfCnpj.equals(cliente.getCpfCnpj()) && repository.existsByCpfCnpj(formattedCpfCnpj)) {
                throw new ValidationException("CPF/CNPJ já cadastrado.");
            }
            cliente.setCpfCnpj(formattedCpfCnpj);
        }
        if (dto.getTelefone() != null) cliente.setTelefone(dto.getTelefone());
        if (dto.getEmail() != null && !dto.getEmail().equals(cliente.getEmail())) {
            if (repository.existsByEmail(dto.getEmail())) {
                throw new ValidationException("Email já cadastrado.");
            }
            cliente.setEmail(dto.getEmail());
        }
        if (dto.getSenha() != null) cliente.setSenha(passwordEncoder.encode(dto.getSenha()));

        repository.save(cliente);
    }

    public void ativar(UUID id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new ValidationException("Cliente não encontrado."));
        cliente.setAtivo(true);
        repository.save(cliente);
    }

    public void desativar(UUID id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new ValidationException("Cliente não encontrado."));
        cliente.setAtivo(false);
        repository.save(cliente);
    }

    public Page<ClienteResponseDTO> listar(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponseDTO);
    }

    public LoginResponseDTO login(AuthenticationDTO dto) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getSenha());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((Cliente) auth.getPrincipal());
        return new LoginResponseDTO(token);
    }
}