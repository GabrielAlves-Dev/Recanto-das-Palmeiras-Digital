package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repositories;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProdutoRepository extends JpaRepository<Produto, UUID> {
}
