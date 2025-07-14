package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class PedidoItemRequestDTO {
    @NotNull(message = "O ID do produto é obrigatório.")
    private UUID produtoId;

    @NotNull(message = "A quantidade é obrigatória.")
    @Min(value = 1, message = "A quantidade deve ser de no mínimo 1.")
    private Integer quantidade;
}