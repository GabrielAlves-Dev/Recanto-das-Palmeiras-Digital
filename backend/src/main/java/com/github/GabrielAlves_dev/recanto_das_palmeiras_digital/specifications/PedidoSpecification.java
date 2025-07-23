package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.specifications;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido.Pedido;
import org.springframework.data.jpa.domain.Specification;

public class PedidoSpecification {

    public static Specification<Pedido> searchByClienteName(String searchTerm) {
        return (root, query, cb) -> {
            if (searchTerm == null || searchTerm.isBlank()) {
                return cb.conjunction();
            }
            String likePattern = "%" + searchTerm.toLowerCase() + "%";

            return cb.like(cb.lower(root.get("cliente").get("nome")), likePattern);
        };
    }
}
