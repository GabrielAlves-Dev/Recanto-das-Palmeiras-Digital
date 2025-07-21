package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.endereco;

import org.springframework.stereotype.Component;

@Component
public class EnderecoMapper {

    public Endereco toEntity(EnderecoDTO dto) {
        if (dto == null) return null;
        return new Endereco(dto.getRua(), dto.getNumero(), dto.getComplemento(), dto.getBairro(), dto.getCidade(), dto.getUf(), dto.getCep());
    }

    public EnderecoDTO toDTO(Endereco entity) {
        if (entity == null) return null;
        EnderecoDTO dto = new EnderecoDTO();
        dto.setRua(entity.getRua());
        dto.setNumero(entity.getNumero());
        dto.setComplemento(entity.getComplemento());
        dto.setBairro(entity.getBairro());
        dto.setCidade(entity.getCidade());
        dto.setUf(entity.getUf());
        dto.setCep(entity.getCep());
        return dto;
    }
}
