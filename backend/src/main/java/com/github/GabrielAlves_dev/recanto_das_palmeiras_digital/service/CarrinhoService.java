package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.carrinho.CarrinhoItem;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.carrinho.CarrinhoItemRequestDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.carrinho.CarrinhoItemResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.carrinho.CarrinhoMapper;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.Cliente;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.Produto;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.exceptions.NotFoundException;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.exceptions.ValidationException;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.CarrinhoItemRepository;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.ClienteRepository;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CarrinhoService {

    @Autowired
    private CarrinhoItemRepository carrinhoItemRepository;
    @Autowired
    private ProdutoRepository produtoRepository;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private CarrinhoMapper carrinhoMapper;

    // Simulação do ID do cliente logado.
    private UUID getClienteIdLogado() {
        return UUID.fromString("7460e3a8-e2c8-4d1c-9f10-93d36f093f0e");
    }

    public List<CarrinhoItemResponseDTO> getCarrinho() {
        UUID clienteId = getClienteIdLogado();
        List<CarrinhoItem> itens = carrinhoItemRepository.findByClienteId(clienteId);
        return itens.stream()
                .map(carrinhoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CarrinhoItemResponseDTO adicionarItem(CarrinhoItemRequestDTO requestDTO) {
        UUID clienteId = getClienteIdLogado();
        Cliente cliente = clienteRepository.findById(clienteId).orElseThrow(() -> new NotFoundException("Cliente não encontrado."));
        Produto produto = produtoRepository.findById(requestDTO.getProdutoId()).orElseThrow(() -> new NotFoundException("Produto não encontrado."));

        if (produto.getQuantidade() < requestDTO.getQuantidade()) {
            throw new ValidationException("Estoque insuficiente para o produto: " + produto.getNome());
        }

        Optional<CarrinhoItem> itemExistenteOpt = carrinhoItemRepository.findByClienteIdAndProdutoId(clienteId, produto.getId());

        CarrinhoItem item;
        if (itemExistenteOpt.isPresent()) {
            item = itemExistenteOpt.get();
            item.setQuantidade(item.getQuantidade() + requestDTO.getQuantidade());
        } else {
            item = new CarrinhoItem();
            item.setCliente(cliente);
            item.setProduto(produto);
            item.setQuantidade(requestDTO.getQuantidade());
        }

        if (produto.getQuantidade() < item.getQuantidade()) {
            throw new ValidationException("Estoque insuficiente para a quantidade total solicitada do produto: " + produto.getNome());
        }

        return carrinhoMapper.toResponseDTO(carrinhoItemRepository.save(item));
    }

    @Transactional
    public CarrinhoItemResponseDTO atualizarItem(UUID produtoId, CarrinhoItemRequestDTO requestDTO) {
        UUID clienteId = getClienteIdLogado();
        CarrinhoItem item = carrinhoItemRepository.findByClienteIdAndProdutoId(clienteId, produtoId)
                .orElseThrow(() -> new NotFoundException("Item com produto ID " + produtoId + " não encontrado no carrinho."));

        Produto produto = item.getProduto();
        if (produto.getQuantidade() < requestDTO.getQuantidade()) {
            throw new ValidationException("Estoque insuficiente para a quantidade solicitada do produto: " + produto.getNome());
        }

        item.setQuantidade(requestDTO.getQuantidade());
        return carrinhoMapper.toResponseDTO(carrinhoItemRepository.save(item));
    }

    @Transactional
    public void removerItem(UUID produtoId) {
        UUID clienteId = getClienteIdLogado();
        CarrinhoItem item = carrinhoItemRepository.findByClienteIdAndProdutoId(clienteId, produtoId)
                .orElseThrow(() -> new NotFoundException("Item não encontrado no carrinho."));
        carrinhoItemRepository.delete(item);
    }

    @Transactional
    public void limparCarrinho() {
        UUID clienteId = getClienteIdLogado();
        List<CarrinhoItem> itens = carrinhoItemRepository.findByClienteId(clienteId);
        if (!itens.isEmpty()) {
            carrinhoItemRepository.deleteAll(itens);
        }
    }
}