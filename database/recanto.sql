CREATE TYPE tipo_cargo AS ENUM (
    'GERENTE',
    'VENDEDOR'
);

CREATE TYPE tipo_status_pedido AS ENUM (
    'Pendente',      -- Pedido recebido, aguardando processamento.
    'Em preparo',    -- Pedido confirmado e sendo preparado.
    'Enviado',       -- Pedido despachado para entrega.
    'Entregue',      -- Pedido concluído e entregue ao cliente.
    'Cancelado',     -- Pedido cancelado (pelo cliente ou admin).
    'Negado'         -- Pedido não aprovado pela administração.
);

CREATE TABLE public.usuario (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    nome character varying(255) NOT NULL,
    email character varying(255) NOT NULL UNIQUE,
    telefone character varying(20),
    cargo tipo_cargo NOT NULL,
    senha character varying(255) NOT NULL,
    ativo boolean DEFAULT true NOT NULL
);

CREATE TABLE public.cliente (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    nome character varying(255) NOT NULL,
    email character varying(255) NOT NULL UNIQUE,
    telefone character varying(20),
    cpf_cnpj character varying(18) UNIQUE, 
    senha character varying(255) NOT NULL,
    ativo boolean DEFAULT true NOT NULL
);

CREATE TABLE public.produto (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    nome character varying(255) NOT NULL,
    descricao text,
    preco numeric(10, 2) NOT NULL,
    quantidade integer DEFAULT 0 NOT NULL,
    imagem_url character varying(255), -- Nome mais descritivo
    ativo boolean DEFAULT true NOT NULL,
    
    CONSTRAINT chk_preco_positivo CHECK (preco > 0),
    CONSTRAINT chk_quantidade_nao_negativa CHECK (quantidade >= 0)
);

-- Tabela de pedidos (RF024, RF025, RF031)
CREATE TABLE public.pedido (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    cliente_id uuid REFERENCES public.cliente(id), -- Pode ser nulo para "venda balcão"
    usuario_id uuid REFERENCES public.usuario(id), -- Vendedor que criou o pedido
    data_pedido timestamp with time zone DEFAULT now() NOT NULL,
    status tipo_status_pedido NOT NULL,
    valor_total numeric(10, 2) NOT NULL,
    forma_pagamento character varying(50),
    observacoes text,
    
    -- Se o pedido foi feito online, usuario_id será NULL.
    -- Se foi "venda balcão", cliente_id pode ser NULL, e usuario_id será preenchido.
    CONSTRAINT chk_origem_pedido CHECK (
        (cliente_id IS NOT NULL AND usuario_id IS NULL) OR -- Pedido Online
        (usuario_id IS NOT NULL) -- Pedido Administrativo (com ou sem cliente)
    )
);

CREATE TABLE public.pedido_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    pedido_id uuid NOT NULL REFERENCES public.pedido(id) ON DELETE CASCADE, -- Se o pedido for deletado, os itens também são.
    produto_id uuid NOT NULL REFERENCES public.produto(id) ON DELETE RESTRICT, -- Impede a exclusão de um produto que está em um pedido.
    quantidade integer NOT NULL,
    preco_unitario numeric(10, 2) NOT NULL,
    
    CONSTRAINT chk_quantidade_item_positiva CHECK (quantidade > 0)
);


CREATE TABLE public.carrinho_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    cliente_id uuid NOT NULL REFERENCES public.cliente(id) ON DELETE CASCADE,
    produto_id uuid NOT NULL REFERENCES public.produto(id) ON DELETE CASCADE,
    quantidade integer NOT NULL,
    adicionado_em timestamp with time zone DEFAULT now() NOT NULL,

    UNIQUE (cliente_id, produto_id),
    CONSTRAINT chk_quantidade_carrinho_positiva CHECK (quantidade > 0)
);

CREATE TABLE public.token_recuperacao_senha (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    token character varying(255) NOT NULL UNIQUE,
    usuario_id uuid REFERENCES public.usuario(id) ON DELETE CASCADE,
    cliente_id uuid REFERENCES public.cliente(id) ON DELETE CASCADE,
    data_expiracao timestamp with time zone NOT NULL,

    CONSTRAINT chk_token_owner CHECK (
        (usuario_id IS NOT NULL AND cliente_id IS NULL) OR 
        (usuario_id IS NULL AND cliente_id IS NOT NULL)
    )
);

CREATE TABLE public.notificacao (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    destinatario_id uuid NOT NULL REFERENCES public.usuario(id) ON DELETE CASCADE,
    mensagem text NOT NULL,
    link_referencia character varying(255), -- Ex: '/pedidos/uuid-do-pedido'
    lida boolean DEFAULT false NOT NULL,
    data_criacao timestamp with time zone DEFAULT now() NOT NULL
);


CREATE INDEX idx_pedido_cliente_id ON public.pedido(cliente_id);
CREATE INDEX idx_pedido_status ON public.pedido(status);
CREATE INDEX idx_produto_ativo ON public.produto(ativo);
CREATE INDEX idx_cliente_ativo ON public.cliente(ativo);
CREATE INDEX idx_notificacao_destinatario ON public.notificacao(destinatario_id);