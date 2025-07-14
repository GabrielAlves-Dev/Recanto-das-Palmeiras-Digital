package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.Cliente;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido.*;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.Produto;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.exceptions.NotFoundException;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.exceptions.ValidationException;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.ClienteRepository;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.PedidoRepository;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private PedidoMapper pedidoMapper;

    @Transactional
    public PedidoResponseDTO criarPedido(PedidoRequestDTO dto) {
        Pedido pedido = new Pedido();
        pedido.setStatus(StatusPedido.PENDENTE); // Todo pedido começa como pendente
        pedido.setFormaPagamento(dto.getFormaPagamento());
        pedido.setObservacoes(dto.getObservacoes());

        if (dto.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new NotFoundException("Cliente com ID " + dto.getClienteId() + " não encontrado."));
            pedido.setCliente(cliente);
        }

        List<PedidoItem> itens = new ArrayList<>();
        BigDecimal valorTotal = BigDecimal.ZERO;

        for (PedidoItemRequestDTO itemDTO : dto.getItens()) {
            Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                    .orElseThrow(() -> new NotFoundException("Produto com ID " + itemDTO.getProdutoId() + " não encontrado."));

            if (!produto.getAtivo()) {
                throw new ValidationException("O produto '" + produto.getNome() + "' não está ativo e não pode ser vendido.");
            }
            if (produto.getQuantidade() < itemDTO.getQuantidade()) {
                throw new ValidationException("Estoque insuficiente para o produto: '" + produto.getNome() + "'. Disponível: " + produto.getQuantidade());
            }

            PedidoItem pedidoItem = new PedidoItem();
            pedidoItem.setPedido(pedido);
            pedidoItem.setProduto(produto);
            pedidoItem.setQuantidade(itemDTO.getQuantidade());
            pedidoItem.setPrecoUnitario(produto.getPreco());
            itens.add(pedidoItem);

            valorTotal = valorTotal.add(produto.getPreco().multiply(new BigDecimal(itemDTO.getQuantidade())));

            produto.setQuantidade(produto.getQuantidade() - itemDTO.getQuantidade());
            produtoRepository.save(produto);
        }

        pedido.setItens(itens);
        pedido.setValorTotal(valorTotal);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        // Aqui seria o local para disparar a notificação para os vendedores (RF033)
        // Ex: notificacaoService.notificarNovoPedido(pedidoSalvo);

        return pedidoMapper.toPedidoResponseDTO(pedidoSalvo);
    }

    public Page<PedidoResponseDTO> listarTodos(Pageable pageable) {
        return pedidoRepository.findAll(pageable).map(pedidoMapper::toPedidoResponseDTO);
    }

    public PedidoResponseDTO buscarPorId(UUID id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Pedido com ID " + id + " não encontrado."));
        return pedidoMapper.toPedidoResponseDTO(pedido);
    }

    @Transactional
    public PedidoResponseDTO atualizarStatus(UUID id, StatusPedido novoStatus) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Pedido com ID " + id + " não encontrado."));

        if (pedido.getStatus() == StatusPedido.ENTREGUE || pedido.getStatus() == StatusPedido.CANCELADO) {
            throw new ValidationException("Não é possível alterar o status de um pedido que já foi " + pedido.getStatus().toString().toLowerCase());
        }

        pedido.setStatus(novoStatus);
        Pedido pedidoAtualizado = pedidoRepository.save(pedido);
        return pedidoMapper.toPedidoResponseDTO(pedidoAtualizado);
    }

    @Transactional
    public PedidoResponseDTO cancelarPedido(UUID id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Pedido com ID " + id + " não encontrado."));

        if (pedido.getStatus() != StatusPedido.PENDENTE && pedido.getStatus() != StatusPedido.EM_PREPARO) {
            throw new ValidationException("O pedido não pode ser cancelado, pois já foi " + pedido.getStatus().toString().toLowerCase());
        }

        for (PedidoItem item : pedido.getItens()) {
            Produto produto = item.getProduto();
            produto.setQuantidade(produto.getQuantidade() + item.getQuantidade());
            produtoRepository.save(produto);
        }

        pedido.setStatus(StatusPedido.CANCELADO);
        Pedido pedidoCancelado = pedidoRepository.save(pedido);
        return pedidoMapper.toPedidoResponseDTO(pedidoCancelado);
    }
}