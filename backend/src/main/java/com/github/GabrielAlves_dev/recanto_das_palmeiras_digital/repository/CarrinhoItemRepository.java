package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.carrinho.CarrinhoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CarrinhoItemRepository extends JpaRepository<CarrinhoItem, UUID> {
    List<CarrinhoItem> findByClienteId(UUID clienteId);
    Optional<CarrinhoItem> findByClienteIdAndProdutoId(UUID clienteId, UUID produtoId);
}