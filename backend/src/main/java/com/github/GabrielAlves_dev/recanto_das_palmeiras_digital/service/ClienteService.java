package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.Cliente;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.ClienteRequestDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.ClienteAutoCadastroDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.ClienteResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.ClienteMapper;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.ClienteRepository;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.exceptions.ValidationException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public UUID autoCadastrar(ClienteAutoCadastroDTO dto) {
        Optional<Cliente> existente = repository.findByEmail(dto.getEmail());

        if (existente.isPresent()) {
            if (existente.get().getAtivo()) {
                throw new ValidationException("Email já cadastrado. Faça login.");
            } else {
                // Simula envio de e-mail
                throw new ValidationException("Conta desativada. Enviamos um link para reativação.");
            }
        }

        if (repository.existsByCpfCnpj(dto.getCpfCnpj())) {
            throw new ValidationException("CPF/CNPJ já cadastrado.");
        }

        Cliente novo = new Cliente();
        novo.setNome(dto.getNome());
        novo.setCpfCnpj(dto.getCpfCnpj());
        novo.setTelefone(dto.getTelefone());
        novo.setEmail(dto.getEmail());
        novo.setSenha(passwordEncoder.encode(dto.getSenha()));
        novo.setAtivo(true);

        return repository.save(novo).getId();
    }

    public UUID cadastrarPorGerente(ClienteRequestDTO dto) {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new ValidationException("Email já cadastrado.");
        }
        if (repository.existsByCpfCnpj(dto.getCpfCnpj())) {
            throw new ValidationException("CPF/CNPJ já cadastrado.");
        }

        Cliente cliente = mapper.toCliente(dto);
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
        if (dto.getCpfCnpj() != null && !dto.getCpfCnpj().equals(cliente.getCpfCnpj())) {
            if (repository.existsByCpfCnpj(dto.getCpfCnpj())) {
                throw new ValidationException("CPF/CNPJ já cadastrado.");
            }
            cliente.setCpfCnpj(dto.getCpfCnpj());
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

    public void desativar(UUID id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new ValidationException("Cliente não encontrado."));

        // TODO: Implementar validação de pedidos pendentes (RF011).
        //  Será necessário injetar um `PedidoRepository` e verificar se existe
        //  algum pedido para este cliente com status 'PENDENTE'.
        //  Ex: if (pedidoRepository.existsByClienteAndStatus(cliente, "PENDENTE")) {
        //         throw new ValidationException("Cliente possui pedidos pendentes e não pode ser desativado.");
        //      }

        cliente.setAtivo(false);
        repository.save(cliente);
    }

    public Page<ClienteResponseDTO> listar(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponseDTO);
    }
}
