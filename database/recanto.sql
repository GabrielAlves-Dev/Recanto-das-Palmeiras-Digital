-- BANCO DE DADOS RECANTO DAS PALMEIRAS DIGITAL

-- Tabela de Usuários (Gerentes e Vendedores)
CREATE TABLE "Usuario" (
  "id_usuario" SERIAL PRIMARY KEY,
  "nome" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "telefone" VARCHAR(20),
  "cargo" VARCHAR(20) NOT NULL CHECK (cargo IN ('GERENTE', 'VENDEDOR')),
  "senha" VARCHAR(255) NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true
);

-- Tabela de Produtos
CREATE TABLE "Produto" (
  "id_produto" SERIAL PRIMARY KEY,
  "nome" VARCHAR(255) NOT NULL,
  "descricao" TEXT,
  "preco" DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
  "quantidade" INT NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
  "imagem" VARCHAR(500),
  "ativo" BOOLEAN NOT NULL DEFAULT true
);

-- Tabela de Clientes
CREATE TABLE "Cliente" (
  "id_cliente" SERIAL PRIMARY KEY,
  "nome" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE,
  "telefone" VARCHAR(20),
  "cpf_cnpj" VARCHAR(20) UNIQUE,
  "senha" VARCHAR(255),
  "ativo" BOOLEAN NOT NULL DEFAULT true
);

-- Tabela de Endereços
CREATE TABLE "Endereco" (
  "id_endereco" SERIAL PRIMARY KEY,
  "cep" VARCHAR(10),
  "rua" VARCHAR(255),
  "numero" VARCHAR(20),
  "bairro" VARCHAR(100),
  "cidade" VARCHAR(100),
  "estado" VARCHAR(50),
  "complemento" VARCHAR(255),
  "id_cliente" INT NOT NULL,
  CONSTRAINT "FK_Endereco_Cliente"
    FOREIGN KEY ("id_cliente")
      REFERENCES "Cliente"("id_cliente") ON DELETE CASCADE
);

-- Tabela de Pedidos
CREATE TABLE "Pedido" (
  "id_pedido" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "id_cliente" INT,
  "id_vendedor" INT,
  "valor_total" DECIMAL(10,2) NOT NULL CHECK (valor_total >= 0),
  "status" VARCHAR(20) NOT NULL DEFAULT 'PENDENTE'
    CHECK (status IN ('PENDENTE', 'CANCELADO', 'EM_PREPARO', 'ENVIADO')),
  "forma_pagamento" VARCHAR(50),
  "observacoes" TEXT,
  "data_pedido" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ,
  CONSTRAINT "FK_Pedido_Cliente"
    FOREIGN KEY ("id_cliente")
      REFERENCES "Cliente"("id_cliente"),
  CONSTRAINT "FK_Pedido_Vendedor"
    FOREIGN KEY ("id_vendedor")
      REFERENCES "Usuario"("id_usuario")
);

-- Tabela de Itens do Pedido
CREATE TABLE "ItemPedido" (
  "id_item_pedido" SERIAL PRIMARY KEY, --pode dar problema com 2 clientes comprando ao mesmo tempo?
  "id_pedido" UUID NOT NULL,
  "id_produto" INT NOT NULL,
  "quantidade" INT NOT NULL CHECK (quantidade > 0),
  "preco_unitario" DECIMAL(10,2) NOT NULL CHECK (preco_unitario >= 0),
  CONSTRAINT "FK_ItemPedido_Pedido"
    FOREIGN KEY ("id_pedido")
      REFERENCES "Pedido"("id_pedido") ON DELETE CASCADE,
  CONSTRAINT "FK_ItemPedido_Produto"
    FOREIGN KEY ("id_produto")
      REFERENCES "Produto"("id_produto")
);

-- Tabela de Carrinho
CREATE TABLE "Carrinho" (
  "id_carrinho" SERIAL PRIMARY KEY,
  "id_cliente" INT NOT NULL,
  "id_produto" INT NOT NULL,
  "quantidade" INT NOT NULL CHECK (quantidade > 0),
  CONSTRAINT "FK_Carrinho_Cliente"
    FOREIGN KEY ("id_cliente")
      REFERENCES "Cliente"("id_cliente") ON DELETE CASCADE,
  CONSTRAINT "FK_Carrinho_Produto"
    FOREIGN KEY ("id_produto")
      REFERENCES "Produto"("id_produto") ON DELETE CASCADE,
  UNIQUE ("id_cliente", "id_produto") -- Garante um único item de produto por carrinho de cliente.
);


-- ÍNDICES PARA OTIMIZAÇÃO DE CONSULTAS
CREATE INDEX "idx_produto_nome" ON "Produto"("nome");
CREATE INDEX "idx_produto_categoria" ON "Produto"("id_categoria");
CREATE INDEX "idx_cliente_email" ON "Cliente"("email");
CREATE INDEX "idx_cliente_cpf_cnpj" ON "Cliente"("cpf_cnpj");
CREATE INDEX "idx_pedido_cliente" ON "Pedido"("id_cliente");
CREATE INDEX "idx_pedido_status" ON "Pedido"("status");
CREATE INDEX "idx_pedido_data" ON "Pedido"("data_pedido");


-- DADOS INICIAIS

-- Inserir categorias padrão
INSERT INTO "Categoria" (nome) VALUES
('Flores'),
('Vasos'),
('Plantas'),
('Acessórios');

-- Inserir primeiro gerente
INSERT INTO "Usuario" (nome, email, cargo, senha, ativo) VALUES
('Administrador', 'admin@recantodaspalmerias.com', 'GERENTE', 'senha_forte_hash', true);
