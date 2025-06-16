package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository repo;

    public Produto salvarProduto(Produto produto) {
        return repo.save(produto);
    }

    public Produto atualizarProduto(Integer id, Produto dados) {
        Produto existente = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + id));
        existente.setNome(dados.getNome());
        existente.setDescricao(dados.getDescricao());
        existente.setPreco(dados.getPreco());
        existente.setQuantidade(dados.getQuantidade());
        existente.setImagem(dados.getImagem());
        return repo.save(existente);
    }

    public void setAtivo(Integer id, boolean ativo) {
        Produto existente = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + id));
        existente.setAtivo(ativo);
        repo.save(existente);
    }

    public Page<Produto> listar(String nome, BigDecimal minPreco, BigDecimal maxPreco,
                                Pageable pageable) {
        List<Specification<Produto>> filtros = new ArrayList<>();

        if (nome != null && !nome.isBlank()) {
            filtros.add(ProdutoSpecification.porNome(nome));
        }
        if (minPreco != null || maxPreco != null) {
            filtros.add(ProdutoSpecification.porPrecoEntre(minPreco, maxPreco));
        }

        Specification<Produto> spec = filtros.stream()
                .reduce(Specification::and)
                .orElse(null);

        return repo.findAll(spec, pageable);
    }
}