package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class PedidoRequestDTO {

    private UUID clienteId; // Opcional para venda de balcão

    // private UUID usuarioId; // Será pego do usuário autenticado no futuro

    @NotEmpty(message = "O pedido deve conter pelo menos um item.")
    private List<PedidoItemRequestDTO> itens;

    @NotNull(message = "A forma de pagamento é obrigatória.")
    private String formaPagamento;

    private String observacoes;
}