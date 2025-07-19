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

-- =============================================
-- INSERIR USUÁRIOS (GERENTE E VENDEDOR)
-- A coluna 'id' é omitida para que o banco de dados gere o UUID
-- Senhas são 'senha123' e 'senha456' em BCrypt
-- =============================================
INSERT INTO public.usuario (nome, email, telefone, cargo, senha, ativo) VALUES
('Gabriel Alves', 'gerente@email.com', '(85) 99999-0001', 'GERENTE', '$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R', true),
('Tiago Tito', 'vendedor@email.com', '(85) 99999-0002', 'VENDEDOR', '$2a$10$h7k.X2m.l.uQd2F4G3j.Y8k.w2m.l.R9P.G2I.w3j.H8', true);

-- =============================================
-- INSERIR CLIENTES (10)
-- A coluna 'id' é omitida
-- =============================================
INSERT INTO public.cliente (nome, email, telefone, cpf_cnpj, senha, ativo) VALUES
('Ana Carolina', 'ana.carolina@email.com', '(11) 98765-4321', '111.111.111-11', '$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R', true),
('Bruno Costa', 'bruno.costa@email.com', '(21) 91234-5678', '222.222.222-22', '$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R', true),
('Clara Dias', 'clara.dias@email.com', '(31) 98888-7777', '333.333.333-33', '$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R', true),
('Daniel Rocha', 'daniel.rocha@email.com', '(41) 97777-6666', '444.444.444-44', '$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R', true),
('Eduarda Lima', 'eduarda.lima@email.com', '(51) 96666-5555', '555.555.555-55', '$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R', true),
('Felipe Barros', 'felipe.barros@email.com', '(61) 95555-4444', '666.666.666-66', '$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R', true),
('Gabriela Melo', 'gabriela.melo@email.com', '(71) 94444-3333', '777.777.777-77', '$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R', true),
('Heitor Nunes', 'heitor.nunes@email.com', '(81) 93333-2222', '888.888.888-88', '$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R', true),
('Isabela Paiva', 'isabela.paiva@email.com', '(91) 92222-1111', '999.999.999-99', '$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R', true),
('João Victor', 'joao.victor@email.com', '(98) 91111-0000', '000.000.000-00', '$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R', true);

-- =============================================
-- INSERIR PRODUTOS (50)
-- A coluna 'id' é omitida
-- =============================================
INSERT INTO public.produto (nome, descricao, preco, quantidade, ativo) VALUES
('Rosa Vermelha (Unidade)', 'Clássica rosa vermelha para presentear.', 7.50, 100, true),
('Buquê de Rosas Coloridas', '12 rosas de cores variadas.', 85.00, 20, true),
('Orquídea Phalaenopsis Branca', 'Orquídea elegante em vaso de vidro.', 120.00, 15, true),
('Girassol em Vaso', 'Lindo girassol para alegrar o ambiente.', 45.00, 30, true),
('Lírio Branco', 'Lírios brancos que simbolizam a paz.', 25.00, 50, true),
('Cesta de Café da Manhã', 'Cesta completa com pães, frutas e frios.', 180.00, 10, true),
('Vaso de Tulipas Amarelas', 'Tulipas vibrantes para a primavera.', 95.00, 25, true),
('Cacto Mandacaru Pequeno', 'Cacto resistente e de fácil cuidado.', 35.00, 40, true),
('Suculenta Echeveria', 'Suculenta em formato de flor.', 15.00, 80, true),
('Arranjo de Flores do Campo', 'Mix de flores do campo frescas.', 70.00, 22, true),
('Begônia Maculata', 'Folhagem única com pintas brancas.', 65.00, 18, true),
('Samambaia Americana', 'Planta pendente clássica.', 55.00, 35, true),
('Azaleia em Vaso', 'Azaleia florida para jardins e varandas.', 40.00, 30, true),
('Mini Rosa Chá', 'Roseira de pequeno porte.', 38.00, 45, true),
('Coração de Pelúcia com Rosa', 'Coração de pelúcia segurando uma rosa.', 60.00, 20, true),
('Gérbera Colorida', 'Gérberas de cores intensas.', 9.00, 150, true),
('Violeta Africana', 'Pequena e delicada, ideal para interiores.', 12.00, 60, true),
('Jibóia (Epipremnum aureum)', 'Planta trepadeira de fácil cultivo.', 48.00, 28, true),
('Espada de São Jorge', 'Planta protetora e resistente.', 33.00, 50, true),
('Antúrio Vermelho', 'Flor exótica e duradoura.', 75.00, 17, true),
('Kalanchoe (Flor da Fortuna)', 'Pequenas flores em buquês coloridos.', 18.00, 70, true),
('Coroa de Flores para Velório', 'Homenagem fúnebre com flores nobres.', 350.00, 5, true),
('Terrário de Suculentas', 'Mini ecossistema em vidro.', 90.00, 12, true),
('Zamioculca', 'Folhagem verde escura, muito resistente.', 80.00, 20, true),
('Pimenta Ornamental', 'Frutos coloridos e decorativos.', 25.00, 40, true),
('Buquê de Noiva (Rosas Brancas)', 'Buquê clássico e elegante para noivas.', 450.00, 3, true),
('Costela de Adão', 'Folhagem tropical com recortes característicos.', 110.00, 15, true),
('Margarida Branca (Maço)', 'Maço com margaridas brancas e frescas.', 30.00, 50, true),
('Cravo Vermelho (Unidade)', 'Cravo de cor intensa e perfume suave.', 5.00, 200, true),
('Astromélia Colorida (Galho)', 'Galho com várias flores de astromélia.', 15.00, 80, true),
('Caixa de Bombons e Flores', 'Combinação de flores e chocolates finos.', 130.00, 18, true),
('Orquídea Vanda Suspensa', 'Orquídea com raízes aéreas.', 160.00, 8, true),
('Peperômia Melancia', 'Folhas que lembram a casca de uma melancia.', 42.00, 33, true),
('Alecrim em Vaso', 'Erva aromática para tempero e decoração.', 22.00, 40, true),
('Lavanda em Vaso', 'Planta perfumada com propriedades relaxantes.', 35.00, 30, true),
('Buquê de Lisianthus', 'Flores delicadas semelhantes a rosas.', 95.00, 15, true),
('Ciclame', 'Flores vibrantes que surgem no inverno.', 40.00, 25, true),
('Bonsai de Ficus', 'Árvore em miniatura para cultivo interno.', 250.00, 7, true),
('Planta Carnívora (Dionaea)', 'Pequena planta carnívora em vaso.', 55.00, 10, true),
('Bico de Papagaio (Natal)', 'Planta tradicional da época de Natal.', 50.00, 0, false),
('Singônio', 'Folhagem em formato de seta.', 38.00, 25, true),
('Maranta Tricolor', 'Folhas com padrões rosa, verde e creme.', 68.00, 20, true),
('Dracena de Madagascar', 'Planta com tronco fino e folhas pontiagudas.', 78.00, 15, true),
('Palmeira Ráfia', 'Palmeira elegante para interiores.', 150.00, 10, true),
('Buquê de Astromélias', 'Buquê alegre e duradouro.', 75.00, 20, true),
('Vaso de Hortênsias Azuis', 'Flores volumosas e de cor intensa.', 85.00, 12, true),
('Ficus Lyrata', 'Árvore de interior com folhas grandes.', 180.00, 8, true),
('Caladium', 'Folhagem colorida em tons de rosa, branco e verde.', 58.00, 22, true),
('Ursinho de Pelúcia Grande', 'Urso de pelúcia para acompanhar flores.', 90.00, 15, true),
('Vinho e Flores', 'Kit com vinho tinto e um arranjo de flores.', 220.00, 10, true);


-- =============================================
-- INSERIR PEDIDOS (5 por cliente, 50 total)
-- Este bloco cria os pedidos e os itens de forma procedural
-- =============================================
DO $$
DECLARE
    cliente_rec RECORD;
    produto1_rec RECORD;
    produto2_rec RECORD;
    data_pedido_base TIMESTAMP;
    novo_pedido_id UUID;
BEGIN
    -- Itera sobre cada cliente que foi inserido anteriormente
    FOR cliente_rec IN SELECT id FROM public.cliente LOOP
        -- Cria 5 pedidos para cada cliente
        FOR i IN 1..5 LOOP
            -- Seleciona dois produtos aleatórios para o pedido
            SELECT id, preco INTO produto1_rec FROM public.produto WHERE ativo = true AND quantidade > 0 ORDER BY random() LIMIT 1;
            SELECT id, preco INTO produto2_rec FROM public.produto WHERE ativo = true AND quantidade > 0 AND id <> produto1_rec.id ORDER BY random() LIMIT 1;
            
            -- Gera uma data de pedido aleatória nos últimos 60 dias
            data_pedido_base := NOW() - (random() * 60 * interval '1 day');
            
            -- Insere o pedido e captura o ID gerado automaticamente
            INSERT INTO public.pedido (cliente_id, data_pedido, status, valor_total, forma_pagamento, observacoes)
            VALUES (
                cliente_rec.id, 
                data_pedido_base, 
                (ARRAY['Pendente', 'Em preparo', 'Enviado', 'Entregue', 'Cancelado'])[floor(random() * 5 + 1)]::tipo_status_pedido,
                (produto1_rec.preco * 1) + (produto2_rec.preco * 2), 
                (ARRAY['Cartão de Crédito', 'PIX', 'Dinheiro'])[floor(random() * 3 + 1)],
                'Pedido de teste gerado por script.'
            ) RETURNING id INTO novo_pedido_id;

            -- Insere os itens do pedido usando o ID do pedido capturado
            INSERT INTO public.pedido_item (pedido_id, produto_id, quantidade, preco_unitario) VALUES
            (novo_pedido_id, produto1_rec.id, 1, produto1_rec.preco),
            (novo_pedido_id, produto2_rec.id, 2, produto2_rec.preco);
        END LOOP;
    END LOOP;
END $$;