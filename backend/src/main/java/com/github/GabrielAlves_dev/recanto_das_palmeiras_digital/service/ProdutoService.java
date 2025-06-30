package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.Produto;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.ProdutoMapper;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.ProdutoRequestDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.exceptions.ValidationException;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.ProdutoRepository;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.specifications.ProdutoSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoMapper produtoMapper;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private StorageService storageService;

    private static final long TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024; // 5MB

    public UUID salvarProduto(ProdutoRequestDTO dto) {
        validarNomeDuplicado(dto.getNome());

        Produto produto = produtoMapper.toProduto(dto);

        MultipartFile imagem = dto.getImagem();
        if (imagem != null && !imagem.isEmpty()) {
            validarImagem(imagem);
            String caminhoImagem = storageService.salvarImagem(imagem);
            produto.setImagem(caminhoImagem);
        } else {
            produto.setImagem("uploads/padrao.jpg");
        }

        return produtoRepository.save(produto).getId();
    }

    public Produto atualizarProduto(Integer id, ProdutoRequestDTO dto) {
        Produto existente = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + id));

        if (!dto.getNome().equalsIgnoreCase(existente.getNome())) {
            validarNomeDuplicado(dto.getNome());
        }

        Produto atualizado = produtoMapper.toProduto(dto);

        existente.setNome(atualizado.getNome());
        existente.setDescricao(atualizado.getDescricao());
        existente.setPreco(atualizado.getPreco());
        existente.setQuantidade(atualizado.getQuantidade());

        MultipartFile novaImagem = dto.getImagem();
        if (novaImagem != null && !novaImagem.isEmpty()) {
            validarImagem(novaImagem);

            if (existente.getImagem() != null) {
                storageService.deletarImagem(existente.getImagem());
            }

            String caminhoImagem = storageService.salvarImagem(novaImagem);
            existente.setImagem(caminhoImagem);
        }

        return produtoRepository.save(existente);
    }

    public void setAtivo(Integer id, boolean ativo) {
        Produto existente = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + id));

        if (!ativo && existente.getQuantidade() > 0) {
            throw new ValidationException("Não é possível desativar um produto com quantidade em estoque.");
        }

        existente.setAtivo(ativo);
        produtoRepository.save(existente);
    }

    public Page<Produto> listar(String nome, BigDecimal minPreco, BigDecimal maxPreco, Boolean ativo, Boolean comEstoque, Pageable pageable) {
        Specification<Produto> spec = Specification.where(null);

        if (nome != null && !nome.isBlank()) {
            spec = spec.and(ProdutoSpecification.porNome(nome));
        }
        if (minPreco != null || maxPreco != null) {
            spec = spec.and(ProdutoSpecification.porPrecoEntre(minPreco, maxPreco));
        }
        if (ativo != null) {
            spec = spec.and(ProdutoSpecification.porAtivo(ativo));
        }
        if (comEstoque != null) {
            spec = spec.and(ProdutoSpecification.comEstoque(comEstoque));
        }

        return produtoRepository.findAll(spec, pageable);
    }

    public Produto findById(Integer id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + id));
    }

    private void validarNomeDuplicado(String nome) {
        if (produtoRepository.existsByNome(nome)) {
            throw new ValidationException("Nome do produto já existente");
        }
    }

    private void validarImagem(MultipartFile imagem) {
        String nomeArquivo = imagem.getOriginalFilename();

        if (nomeArquivo == null || !nomeArquivo.toLowerCase().matches(".*\\.(jpg|png)$")) {
            throw new ValidationException("Formato de imagem inválido. Use .jpg ou .png");
        }

        if (imagem.getSize() > TAMANHO_MAXIMO_IMAGEM) {
            throw new ValidationException("Imagem excede o limite de 5MB");
        }
    }
}
