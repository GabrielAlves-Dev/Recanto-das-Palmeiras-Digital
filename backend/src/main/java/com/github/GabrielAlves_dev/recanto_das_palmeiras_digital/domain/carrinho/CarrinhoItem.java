package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.carrinho;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.Cliente;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.Produto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "carrinho_item")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CarrinhoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(name = "adicionado_em", nullable = false)
    private ZonedDateTime adicionadoEm;

    @PrePersist
    protected void onCreate() {
        this.adicionadoEm = ZonedDateTime.now();
    }
}