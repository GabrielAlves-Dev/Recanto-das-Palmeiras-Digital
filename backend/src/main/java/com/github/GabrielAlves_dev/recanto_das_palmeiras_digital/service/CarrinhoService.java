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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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

    private Cliente getAuthenticatedCliente() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            throw new IllegalStateException("O principal de autenticação não é uma instância de UserDetails.");
        }

        return clienteRepository.findByEmail(username)
                .orElseThrow(() -> new NotFoundException("Cliente autenticado não encontrado no banco de dados. Email: " + username));
    }

    public List<CarrinhoItemResponseDTO> getCarrinho() {
        Cliente cliente = getAuthenticatedCliente();
        List<CarrinhoItem> itens = carrinhoItemRepository.findByClienteId(cliente.getId());
        return itens.stream()
                .map(carrinhoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CarrinhoItemResponseDTO adicionarItem(CarrinhoItemRequestDTO requestDTO) {
        Cliente cliente = getAuthenticatedCliente();
        Produto produto = produtoRepository.findById(requestDTO.getProdutoId())
                .orElseThrow(() -> new NotFoundException("Produto não encontrado."));

        if (!produto.getAtivo()) {
            throw new ValidationException("Produto '" + produto.getNome() + "' não está disponível para venda.");
        }
        if (produto.getQuantidade() < requestDTO.getQuantidade()) {
            throw new ValidationException("Estoque insuficiente para o produto: " + produto.getNome());
        }

        Optional<CarrinhoItem> itemExistenteOpt = carrinhoItemRepository.findByClienteIdAndProdutoId(cliente.getId(), produto.getId());

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
        Cliente cliente = getAuthenticatedCliente();
        CarrinhoItem item = carrinhoItemRepository.findByClienteIdAndProdutoId(cliente.getId(), produtoId)
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
        Cliente cliente = getAuthenticatedCliente();
        CarrinhoItem item = carrinhoItemRepository.findByClienteIdAndProdutoId(cliente.getId(), produtoId)
                .orElseThrow(() -> new NotFoundException("Item não encontrado no carrinho."));
        carrinhoItemRepository.delete(item);
    }

    @Transactional
    public void limparCarrinho() {
        Cliente cliente = getAuthenticatedCliente();
        List<CarrinhoItem> itens = carrinhoItemRepository.findByClienteId(cliente.getId());
        if (!itens.isEmpty()) {
            carrinhoItemRepository.deleteAll(itens);
        }
    }
}