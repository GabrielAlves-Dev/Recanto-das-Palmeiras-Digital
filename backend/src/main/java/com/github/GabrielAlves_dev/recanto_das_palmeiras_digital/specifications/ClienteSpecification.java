package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.specifications;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.Cliente;
import org.springframework.data.jpa.domain.Specification;

public class ClienteSpecification {

    public static Specification<Cliente> search(String searchTerm) {
        return (root, query, cb) -> {
            if (searchTerm == null || searchTerm.isBlank()) {
                return cb.conjunction();
            }
            String likePattern = "%" + searchTerm.toLowerCase() + "%";

            return cb.or(
                cb.like(cb.lower(root.get("nome")), likePattern),
                cb.like(cb.lower(root.get("email")), likePattern),
                cb.like(root.get("cpfCnpj"), likePattern)
            );
        };
    }
}
