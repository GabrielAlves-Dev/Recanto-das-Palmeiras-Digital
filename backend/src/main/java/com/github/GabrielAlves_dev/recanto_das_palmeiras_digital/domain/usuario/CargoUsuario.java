package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario;

public enum CargoUsuario {
    GERENTE("GERENTE"),
    VENDEDOR("VENDEDOR");

    private String cargo;

    CargoUsuario(String cargo) {
        this.cargo = cargo;
    }

    public String getCargo() {
        return cargo;
    }
}
