package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer>, JpaSpecificationExecutor<Produto> {
    boolean existsByNome(String nome);
}
