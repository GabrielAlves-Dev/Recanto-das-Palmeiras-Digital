package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente;

import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public ClienteResponseDTO toResponseDTO(Cliente cliente) {
        return ClienteResponseDTO.builder()
                .id(cliente.getId())
                .nome(cliente.getNome())
                .email(cliente.getEmail())
                .telefone(cliente.getTelefone())
                .cpfCnpj(cliente.getCpfCnpj())
                .ativo(cliente.getAtivo())
                .build();
    }

    public Cliente toCliente(ClienteRequestDTO dto) {
        Cliente c = new Cliente();
        c.setNome(dto.getNome());
        c.setEmail(dto.getEmail());
        c.setTelefone(dto.getTelefone());
        c.setCpfCnpj(dto.getCpfCnpj());
        return c;
    }
}
