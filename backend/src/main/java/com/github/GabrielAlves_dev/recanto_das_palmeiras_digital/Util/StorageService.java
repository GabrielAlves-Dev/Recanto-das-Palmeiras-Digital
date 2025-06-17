package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Util;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class StorageService {

    private final Path root = Paths.get("uploads");

    public String salvarImagem(MultipartFile file) {
        try {
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            String nomeArquivo = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path destino = root.resolve(nomeArquivo);
            Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            return destino.toString();
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar imagem: " + e.getMessage());
        }
    }

    public void deletarImagem(String caminhoRelativo) {
        Path caminhoCompleto = Paths.get("uploads").resolve(caminhoRelativo);
        try {
            Files.deleteIfExists(caminhoCompleto);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao excluir imagem antiga: " + caminhoRelativo, e);
        }
    }

}
