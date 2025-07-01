package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.util;

public class CpfCnpjUtils {

    public static String clean(String cpfCnpj) {
        if (cpfCnpj == null) {
            return null;
        }
        return cpfCnpj.replaceAll("[^0-9]", "");
    }

    public static String formatCpf(String cpf) {
        if (cpf == null || cpf.length() != 11) {
            return cpf;
        }
        return cpf.substring(0, 3) + "." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-" + cpf.substring(9);
    }

    public static String formatCnpj(String cnpj) {
        if (cnpj == null || cnpj.length() != 14) {
            return cnpj;
        }
        return cnpj.substring(0, 2) + "." + cnpj.substring(2, 5) + "." + cnpj.substring(5, 8) + "/" + cnpj.substring(8, 12) + "-" + cnpj.substring(12);
    }

    public static String format(String cpfCnpj) {
        if (cpfCnpj == null) {
            return null;
        }
        String cleaned = clean(cpfCnpj);
        if (cleaned.length() == 11) {
            return formatCpf(cleaned);
        }
        if (cleaned.length() == 14) {
            return formatCnpj(cleaned);
        }
        return cpfCnpj;
    }
}