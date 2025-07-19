package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido.Pedido;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido.StatusPedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, UUID> {
    Page<Pedido> findByClienteId(UUID clienteId, Pageable pageable);

    boolean existsByClienteIdAndStatusIn(UUID clienteId, List<StatusPedido> statuses);
}