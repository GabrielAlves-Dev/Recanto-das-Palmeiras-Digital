package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.*;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.AuthenticationDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.LoginResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.ClienteRepository;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.exceptions.NotFoundException;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.exceptions.ValidationException;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.util.CpfCnpjUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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

    private Cliente getAuthenticatedCliente() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        return repository.findByEmail(username)
                .orElseThrow(() -> new NotFoundException("Cliente autenticado não encontrado. Email: " + username));
    }

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

        if (formattedCpfCnpj != null && repository.existsByCpfCnpj(formattedCpfCnpj)) {
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
        if (formattedCpfCnpj != null && repository.existsByCpfCnpj(formattedCpfCnpj)) {
            throw new ValidationException("CPF/CNPJ já cadastrado.");
        }

        Cliente cliente = mapper.toCliente(dto);
        cliente.setCpfCnpj(formattedCpfCnpj);
        cliente.setSenha(passwordEncoder.encode(dto.getSenha()));
        cliente.setAtivo(true);

        return repository.save(cliente).getId();
    }

    public ClienteResponseDTO buscarPorClienteAutenticado() {
        Cliente cliente = getAuthenticatedCliente();
        return mapper.toResponseDTO(cliente);
    }

    @Transactional
    public void editarClienteAutenticado(ClienteRequestDTO dto) {
        Cliente cliente = getAuthenticatedCliente();
        this.editar(cliente.getId(), dto);
    }

    public ClienteResponseDTO buscarPorId(UUID id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente não encontrado."));
        return mapper.toResponseDTO(cliente);
    }

    @Transactional
    public void editar(UUID id, ClienteRequestDTO dto) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente não encontrado."));

        if (dto.getNome() != null && !dto.getNome().isBlank()) cliente.setNome(dto.getNome());
        if (dto.getCpfCnpj() != null && !dto.getCpfCnpj().isBlank()) {
            String cleanedCpfCnpj = CpfCnpjUtils.clean(dto.getCpfCnpj());
            String formattedCpfCnpj = CpfCnpjUtils.format(cleanedCpfCnpj);
            if (!formattedCpfCnpj.equals(cliente.getCpfCnpj()) && repository.existsByCpfCnpj(formattedCpfCnpj)) {
                throw new ValidationException("CPF/CNPJ já cadastrado.");
            }
            cliente.setCpfCnpj(formattedCpfCnpj);
        }
        if (dto.getTelefone() != null && !dto.getTelefone().isBlank()) cliente.setTelefone(dto.getTelefone());
        if (dto.getEmail() != null && !dto.getEmail().isBlank() && !dto.getEmail().equals(cliente.getEmail())) {
            if (repository.existsByEmail(dto.getEmail())) {
                throw new ValidationException("Email já cadastrado.");
            }
            cliente.setEmail(dto.getEmail());
        }
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) cliente.setSenha(passwordEncoder.encode(dto.getSenha()));

        repository.save(cliente);
    }

    public void ativar(UUID id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente não encontrado."));
        cliente.setAtivo(true);
        repository.save(cliente);
    }

    public void desativar(UUID id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente não encontrado."));
        cliente.setAtivo(false);
        repository.save(cliente);
    }

    public Page<ClienteResponseDTO> listar(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponseDTO);
    }
}