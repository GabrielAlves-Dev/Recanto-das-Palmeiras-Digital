-- BANCO DE DADOS RECANTO DAS PALMEIRAS DIGITAL

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- Para funções de hash

-- Tabela de Usuários (Gerentes e Vendedores)
CREATE TABLE usuario (
  "id" UUID get_random_uuid() PRIMARY KEY,
  "nome" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "telefone" VARCHAR(20),
  "cargo" VARCHAR(20) NOT NULL CHECK (cargo IN ('GERENTE', 'VENDEDOR')),
  "senha" VARCHAR(255) NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true
);

-- Tabela de Produtos
CREATE TABLE produto (
  "id" UUID get_random_uuid() PRIMARY KEY,
  "nome" VARCHAR(100) NOT NULL,
  "descricao" VARCHAR(255),
  "preco" DECIMAL(10,2) NOT NULL CHECK (preco > 0),
  "quantidade" INT NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
  "imagem_url" VARCHAR(100),
  "ativo" BOOLEAN NOT NULL DEFAULT true
);

-- Tabela de Clientes
CREATE TABLE cliente (
  "id" UUID get_random_uuid() PRIMARY KEY,
  "nome" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE,
  "telefone" VARCHAR(20),
  "cpf_cnpj" VARCHAR(20) UNIQUE,
  "senha" VARCHAR(255),
  "ativo" BOOLEAN NOT NULL DEFAULT true
);
