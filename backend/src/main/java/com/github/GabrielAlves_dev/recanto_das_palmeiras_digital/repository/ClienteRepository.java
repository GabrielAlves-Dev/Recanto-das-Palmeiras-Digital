package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, UUID> {
    boolean existsByEmail(String email);
    boolean existsByCpfCnpj(String cpfCnpj);
    Optional<Cliente> findByEmail(String email);
}
