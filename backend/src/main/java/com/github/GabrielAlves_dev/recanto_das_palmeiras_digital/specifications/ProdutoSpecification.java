package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.specifications;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.Produto;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProdutoSpecification {

    public static Specification<Produto> porNome(String nome) {
        return (root, query, cb) -> nome == null ? null :
                cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%");
    }

    public static Specification<Produto> porPrecoEntre(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return null;
            if (min == null) return cb.lessThanOrEqualTo(root.get("preco"), max);
            if (max == null) return cb.greaterThanOrEqualTo(root.get("preco"), min);
            return cb.between(root.get("preco"), min, max);
        };
    }

    public static Specification<Produto> porAtivo(boolean ativo) {
        return (root, query, cb) -> cb.equal(root.get("ativo"), ativo);
    }

    public static Specification<Produto> comEstoque(boolean comEstoque) {
        return (root, query, cb) -> {
            if (comEstoque) {
                return cb.greaterThan(root.get("quantidade"), 0);
            } else {
                return cb.equal(root.get("quantidade"), 0);
            }
        };
    }
}