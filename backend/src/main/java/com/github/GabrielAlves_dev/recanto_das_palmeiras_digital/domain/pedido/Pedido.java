package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.Cliente;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.Usuario;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.endereco.Endereco;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pedido")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoItem> itens;

    @Embedded
    private Endereco endereco;

    @Column(name = "data_pedido", nullable = false)
    private ZonedDateTime dataPedido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status;

    @Column(name = "valor_total", nullable = false)
    private BigDecimal valorTotal;

    @Column(name = "forma_pagamento")
    private String formaPagamento;

    private String observacoes;

    @PrePersist
    protected void onCreate() {
        this.dataPedido = ZonedDateTime.now();
    }
}