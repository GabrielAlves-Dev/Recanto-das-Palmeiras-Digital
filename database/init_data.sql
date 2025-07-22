--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13

-- Started on 2025-07-22 02:30:28 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 844 (class 1247 OID 16386)
-- Name: tipo_cargo; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.tipo_cargo AS ENUM (
    'GERENTE',
    'VENDEDOR'
);


ALTER TYPE public.tipo_cargo OWNER TO admin;

--
-- TOC entry 847 (class 1247 OID 16392)
-- Name: tipo_status_pedido; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.tipo_status_pedido AS ENUM (
    'PENDENTE',
    'EM_PREPARO',
    'ENVIADO',
    'ENTREGUE',
    'CANCELADO',
    'NEGADO'
);


ALTER TYPE public.tipo_status_pedido OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16478)
-- Name: carrinho_item; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.carrinho_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid NOT NULL,
    produto_id uuid NOT NULL,
    quantidade integer NOT NULL,
    adicionado_em timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_quantidade_carrinho_positiva CHECK ((quantidade > 0))
);


ALTER TABLE public.carrinho_item OWNER TO admin;

--
-- TOC entry 215 (class 1259 OID 16416)
-- Name: cliente; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.cliente (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    telefone character varying(255),
    cpf_cnpj character varying(255),
    senha character varying(255) NOT NULL,
    ativo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.cliente OWNER TO admin;

--
-- TOC entry 221 (class 1259 OID 16517)
-- Name: notificacao; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.notificacao (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    destinatario_id uuid NOT NULL,
    mensagem text NOT NULL,
    link_referencia character varying(255),
    lida boolean DEFAULT false NOT NULL,
    data_criacao timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notificacao OWNER TO admin;

--
-- TOC entry 217 (class 1259 OID 16441)
-- Name: pedido; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.pedido (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid,
    usuario_id uuid,
    data_pedido timestamp with time zone DEFAULT now() NOT NULL,
    status character varying(255) NOT NULL,
    valor_total numeric(38,2) NOT NULL,
    forma_pagamento character varying(255),
    observacoes character varying(255),
    rua character varying(255),
    numero character varying(255),
    complemento character varying(255),
    bairro character varying(255),
    cidade character varying(255),
    uf character varying(255),
    cep character varying(255),
    CONSTRAINT chk_origem_pedido CHECK ((((cliente_id IS NOT NULL) AND (usuario_id IS NULL)) OR (usuario_id IS NOT NULL)))
);


ALTER TABLE public.pedido OWNER TO admin;

--
-- TOC entry 218 (class 1259 OID 16461)
-- Name: pedido_item; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.pedido_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    pedido_id uuid NOT NULL,
    produto_id uuid NOT NULL,
    quantidade integer NOT NULL,
    preco_unitario numeric(38,2) NOT NULL,
    CONSTRAINT chk_quantidade_item_positiva CHECK ((quantidade > 0))
);


ALTER TABLE public.pedido_item OWNER TO admin;

--
-- TOC entry 216 (class 1259 OID 16429)
-- Name: produto; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.produto (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(255) NOT NULL,
    descricao character varying(255),
    preco numeric(38,2) NOT NULL,
    quantidade integer DEFAULT 0 NOT NULL,
    imagem_url character varying(255),
    ativo boolean DEFAULT true NOT NULL,
    imagem character varying(255),
    CONSTRAINT chk_preco_positivo CHECK ((preco > (0)::numeric)),
    CONSTRAINT chk_quantidade_nao_negativa CHECK ((quantidade >= 0))
);


ALTER TABLE public.produto OWNER TO admin;

--
-- TOC entry 220 (class 1259 OID 16498)
-- Name: token_recuperacao_senha; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.token_recuperacao_senha (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    token character varying(255) NOT NULL,
    usuario_id uuid,
    cliente_id uuid,
    data_expiracao timestamp with time zone NOT NULL,
    CONSTRAINT chk_token_owner CHECK ((((usuario_id IS NOT NULL) AND (cliente_id IS NULL)) OR ((usuario_id IS NULL) AND (cliente_id IS NOT NULL))))
);


ALTER TABLE public.token_recuperacao_senha OWNER TO admin;

--
-- TOC entry 214 (class 1259 OID 16405)
-- Name: usuario; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.usuario (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    telefone character varying(20),
    cargo character varying(255) NOT NULL,
    senha character varying(255) NOT NULL,
    ativo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.usuario OWNER TO admin;

--
-- TOC entry 3441 (class 0 OID 16478)
-- Dependencies: 219
-- Data for Name: carrinho_item; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.carrinho_item (id, cliente_id, produto_id, quantidade, adicionado_em) FROM stdin;
\.


--
-- TOC entry 3437 (class 0 OID 16416)
-- Dependencies: 215
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.cliente (id, nome, email, telefone, cpf_cnpj, senha, ativo) FROM stdin;
12311a80-6db8-423b-b6f7-4c7587a24d0d	Ana Carolina	ana.carolina@email.com	(11) 98765-4321	111.111.111-11	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
1c1d7b7c-1b38-43dc-937f-dba8dd651d52	Clara Dias	clara.dias@email.com	(31) 98888-7777	333.333.333-33	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
1eedeec3-8c86-414c-af35-c267f9212b98	Daniel Rocha	daniel.rocha@email.com	(41) 97777-6666	444.444.444-44	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
ab05dea5-be72-4ce6-a702-9b57d7c8e291	Eduarda Lima	eduarda.lima@email.com	(51) 96666-5555	555.555.555-55	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
a380e9a7-a2da-4a8e-8ff8-367d53306528	Felipe Barros	felipe.barros@email.com	(61) 95555-4444	666.666.666-66	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
e3e53da3-58ec-4fff-a2fc-4fefb9bfc463	Gabriela Melo	gabriela.melo@email.com	(71) 94444-3333	777.777.777-77	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
57f7ca19-54d3-4d13-abe0-4d3ab39cada3	Heitor Nunes	heitor.nunes@email.com	(81) 93333-2222	888.888.888-88	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
37b233f3-2891-4b39-b017-8724eaf63823	Isabela Paiva	isabela.paiva@email.com	(91) 92222-1111	999.999.999-99	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
a9ec3f81-1920-46cf-908b-676349a9875e	João Victor	joao.victor@email.com	(98) 91111-0000	000.000.000-00	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
d8320c9c-3c09-4ffa-9268-0f5618be6324	Bruno Costa	bruno.costa@email.com	(21) 91234-5678	222.222.222-22	$2a$10$mWQ.NXQfWrog0Nria99v3uUWwCc0cjJsdQLs2HRHLuAeVjHjD7x3q	t
9c0579e3-47d1-47b3-9a1c-831b0bbbe521	Pedro Alvares	pedro.alvares@email.com	(85) 91111-2222	101.010.101-01	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
3173126a-efc5-4e05-aa54-a2385de9549e	Mariana Silva	mariana.silva@email.com	(85) 92222-3333	121.212.121-21	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
86ae79d7-9ff3-461e-ba63-5619ec422745	Ricardo Souza	ricardo.souza@email.com	(85) 93333-4444	131.313.131-31	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
04f65a1c-09d0-47e3-84a1-a6ac36f85a96	Fernanda Santos	fernanda.santos@email.com	(85) 94444-5555	141.414.141-41	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
14938e1c-2c29-4807-b680-33a295b2e8c1	Lucas Oliveira	lucas.oliveira@email.com	(85) 95555-6666	151.515.151-51	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
b04dd037-6a9c-4d3c-939b-222f78e623ac	Beatriz Costa	beatriz.costa@email.com	(85) 96666-7777	161.616.161-61	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
b7c7a68d-d9a2-4e1e-b8e1-03f7c6d324fe	Gustavo Pereira	gustavo.pereira@email.com	(85) 97777-8888	171.717.171-71	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
3af52e45-03cb-4275-b4fa-2e9fd931ec4e	Larissa Rodrigues	larissa.rodrigues@email.com	(85) 98888-9999	181.818.181-81	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
81eba70e-41d1-4428-b4fd-9689949b6ede	Marcelo Fernandes	marcelo.fernandes@email.com	(85) 99999-1111	191.919.191-91	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
f103771e-8d6c-476a-b839-92219d60b350	Vanessa Almeida	vanessa.almeida@email.com	(85) 90000-2222	202.020.202-02	$2a$10$R9P.G2I.w3j.H8k.w2m.l.uQd2F4G3j.Y8k.w2m.l.R	t
\.


--
-- TOC entry 3443 (class 0 OID 16517)
-- Dependencies: 221
-- Data for Name: notificacao; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.notificacao (id, destinatario_id, mensagem, link_referencia, lida, data_criacao) FROM stdin;
\.


--
-- TOC entry 3439 (class 0 OID 16441)
-- Dependencies: 217
-- Data for Name: pedido; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.pedido (id, cliente_id, usuario_id, data_pedido, status, valor_total, forma_pagamento, observacoes, rua, numero, complemento, bairro, cidade, uf, cep) FROM stdin;
a5b39503-24c3-47bf-93d8-d9de7e30f938	12311a80-6db8-423b-b6f7-4c7587a24d0d	\N	2025-07-07 19:49:35.534262+00	EM_PREPARO	320.00	Dinheiro	Pedido de teste gerado por script.	Avenida Maria Moreira	283	\N	Monte Alverne	Paraipaba	CE	62685-000
4fb6270c-31f4-4a94-aa01-846b2422478a	12311a80-6db8-423b-b6f7-4c7587a24d0d	\N	2025-06-29 13:14:59.005474+00	CANCELADO	240.00	Cartão de Crédito	Pedido de teste gerado por script.	Rua Joaquim Braga	163	\N	Lagoinha	Paraipaba	CE	62685-000
537fefae-f8ab-4a9e-a77d-3d94d08f168b	12311a80-6db8-423b-b6f7-4c7587a24d0d	\N	2025-06-22 03:15:30.604846+00	CANCELADO	205.00	Dinheiro	Pedido de teste gerado por script.	Rua Joaquim Braga	134	\N	Boa Esperança	Paraipaba	CE	62685-000
8db2ed35-0228-4ffa-9f85-e559360cf4d9	12311a80-6db8-423b-b6f7-4c7587a24d0d	\N	2025-07-12 23:30:29.282098+00	PENDENTE	37.50	Cartão de Crédito	Pedido de teste gerado por script.	Rua Maria da Conceição Damasceno	155	\N	Monte Alverne	Paraipaba	CE	62685-000
348eea5c-8c80-4c39-9637-e12364dfbab2	12311a80-6db8-423b-b6f7-4c7587a24d0d	\N	2025-07-01 07:38:43.038074+00	CANCELADO	290.00	Cartão de Crédito	Pedido de teste gerado por script.	Avenida Maria Moreira	114	\N	Boa Esperança	Paraipaba	CE	62685-000
247143af-6879-46b3-8587-4d291838f036	d8320c9c-3c09-4ffa-9268-0f5618be6324	\N	2025-05-23 02:30:52.88288+00	CANCELADO	85.00	Dinheiro	Pedido de teste gerado por script.	Rua Maria da Conceição Damasceno	79	\N	Monte Alverne	Paraipaba	CE	62685-000
5b54a307-1dc4-47c0-a261-8ea648a26a8b	d8320c9c-3c09-4ffa-9268-0f5618be6324	\N	2025-06-08 01:11:53.566202+00	ENVIADO	120.00	Cartão de Crédito	Pedido de teste gerado por script.	Rua Domingos Barroso	255	\N	Lagoinha	Paraipaba	CE	62685-000
a5526a4d-8997-4ffb-9b30-3e4dd5599a25	d8320c9c-3c09-4ffa-9268-0f5618be6324	\N	2025-05-27 11:15:42.715401+00	CANCELADO	225.00	PIX	Pedido de teste gerado por script.	Rua Joaquim Braga	291	\N	Monte Alverne	Paraipaba	CE	62685-000
7302887d-3f41-482c-8d6f-8a99f76f1927	d8320c9c-3c09-4ffa-9268-0f5618be6324	\N	2025-06-27 01:38:19.148646+00	PENDENTE	405.00	Cartão de Crédito	Pedido de teste gerado por script.	Rua Domingos Barroso	48	\N	Boa Esperança	Paraipaba	CE	62685-000
e63298c8-f795-4b66-8594-80ba16d758fc	d8320c9c-3c09-4ffa-9268-0f5618be6324	\N	2025-06-04 19:58:54.740058+00	ENVIADO	335.00	PIX	Pedido de teste gerado por script.	Rua Domingos Barroso	271	\N	Centro	Paraipaba	CE	62685-000
48909338-ffd9-4537-9c94-cc0f3da8d1a4	1c1d7b7c-1b38-43dc-937f-dba8dd651d52	\N	2025-07-04 10:49:11.586259+00	EM_PREPARO	335.00	Dinheiro	Pedido de teste gerado por script.	Rua Joaquim Braga	194	\N	Loteamento	Paraipaba	CE	62685-000
272048af-e43e-4d2f-b198-8443ec5db9d3	1c1d7b7c-1b38-43dc-937f-dba8dd651d52	\N	2025-05-25 14:48:37.393491+00	EM_PREPARO	115.00	PIX	Pedido de teste gerado por script.	Rua João Viana Pessoa	56	\N	Lagoinha	Paraipaba	CE	62685-000
5e6da38e-a097-43ac-860c-eabe0316323f	1c1d7b7c-1b38-43dc-937f-dba8dd651d52	\N	2025-06-11 04:24:19.915929+00	ENVIADO	205.00	Dinheiro	Pedido de teste gerado por script.	Rua Maria da Conceição Damasceno	147	\N	Centro	Paraipaba	CE	62685-000
0c5aa5f2-59d2-4e74-8c9d-f2feac5cc685	1c1d7b7c-1b38-43dc-937f-dba8dd651d52	\N	2025-07-09 00:30:27.848144+00	ENTREGUE	210.00	Dinheiro	Pedido de teste gerado por script.	Rua Domingos Barroso	168	\N	Lagoinha	Paraipaba	CE	62685-000
3705ace1-43e0-4ac0-b4cf-e5a4c494b4f3	1c1d7b7c-1b38-43dc-937f-dba8dd651d52	\N	2025-07-09 09:19:19.473743+00	PENDENTE	367.50	PIX	Pedido de teste gerado por script.	Rua Joaquim Braga	106	\N	Boa Esperança	Paraipaba	CE	62685-000
15a1ed08-13c6-4310-a881-ccbe8ce7fe00	1eedeec3-8c86-414c-af35-c267f9212b98	\N	2025-06-13 04:46:20.954159+00	CANCELADO	367.50	Dinheiro	Pedido de teste gerado por script.	Rua Joaquim Braga	177	\N	Lagoinha	Paraipaba	CE	62685-000
15e211e3-a290-4f70-b718-ccd7d97bd8ef	1eedeec3-8c86-414c-af35-c267f9212b98	\N	2025-06-02 13:52:32.360106+00	CANCELADO	155.00	PIX	Pedido de teste gerado por script.	Rua João Viana Pessoa	252	\N	Monte Alverne	Paraipaba	CE	62685-000
a4a642ce-6014-4367-8e27-089a4fd91eea	1eedeec3-8c86-414c-af35-c267f9212b98	\N	2025-06-11 12:34:09.716904+00	ENVIADO	147.50	Cartão de Crédito	Pedido de teste gerado por script.	Avenida Maria Moreira	82	\N	Monte Alverne	Paraipaba	CE	62685-000
06b0f9b5-c26b-412f-af70-8d18c1531e7f	1eedeec3-8c86-414c-af35-c267f9212b98	\N	2025-06-17 16:23:02.272242+00	ENTREGUE	265.00	Cartão de Crédito	Pedido de teste gerado por script.	Rua Domingos Barroso	121	\N	Centro	Paraipaba	CE	62685-000
56f21b31-93e9-4763-a87a-28e4cacae339	1eedeec3-8c86-414c-af35-c267f9212b98	\N	2025-07-01 10:17:32.51843+00	ENVIADO	50.00	Cartão de Crédito	Pedido de teste gerado por script.	Rua Domingos Barroso	127	\N	Centro	Paraipaba	CE	62685-000
09f467e2-ab25-4f26-b29c-ed2431791f13	ab05dea5-be72-4ce6-a702-9b57d7c8e291	\N	2025-05-30 11:49:35.471379+00	PENDENTE	135.00	Dinheiro	Pedido de teste gerado por script.	Rua João Viana Pessoa	139	\N	Centro	Paraipaba	CE	62685-000
19be3216-6f30-4ab5-9d63-baf4aa39a16b	ab05dea5-be72-4ce6-a702-9b57d7c8e291	\N	2025-06-28 23:40:36.598618+00	ENTREGUE	155.00	Cartão de Crédito	Pedido de teste gerado por script.	Rua João Viana Pessoa	14	\N	Boa Esperança	Paraipaba	CE	62685-000
10f20d22-31fc-4719-9979-f33fede14368	ab05dea5-be72-4ce6-a702-9b57d7c8e291	\N	2025-06-07 18:50:27.979717+00	PENDENTE	97.50	Cartão de Crédito	Pedido de teste gerado por script.	Rua Domingos Barroso	254	\N	Lagoinha	Paraipaba	CE	62685-000
8c3a1141-4b94-4402-8fa0-bda4063557bc	ab05dea5-be72-4ce6-a702-9b57d7c8e291	\N	2025-07-10 20:33:44.443079+00	CANCELADO	165.00	Dinheiro	Pedido de teste gerado por script.	Rua Joaquim Braga	13	\N	Lagoinha	Paraipaba	CE	62685-000
2c13576d-039a-4d5c-adf8-828e0d0f1c6a	ab05dea5-be72-4ce6-a702-9b57d7c8e291	\N	2025-06-03 20:16:55.835874+00	ENTREGUE	215.00	Dinheiro	Pedido de teste gerado por script.	Rua Maria da Conceição Damasceno	218	\N	Centro	Paraipaba	CE	62685-000
9a1ab431-5879-456b-bda9-31ebd8a1318a	a380e9a7-a2da-4a8e-8ff8-367d53306528	\N	2025-05-28 08:47:17.41837+00	EM_PREPARO	75.00	Dinheiro	Pedido de teste gerado por script.	Rua Joaquim Braga	38	\N	Boa Esperança	Paraipaba	CE	62685-000
16cea872-e8a1-4d83-8e34-dd0b2b585e06	a380e9a7-a2da-4a8e-8ff8-367d53306528	\N	2025-07-12 19:02:34.467589+00	PENDENTE	367.50	PIX	Pedido de teste gerado por script.	Avenida Maria Moreira	229	\N	Loteamento	Paraipaba	CE	62685-000
c08120b9-4e1a-4021-9349-917d55b32421	a380e9a7-a2da-4a8e-8ff8-367d53306528	\N	2025-07-12 03:08:04.471334+00	CANCELADO	310.00	Dinheiro	Pedido de teste gerado por script.	Avenida Maria Moreira	23	\N	Loteamento	Paraipaba	CE	62685-000
c014d767-38f6-49a7-91a9-2513d9a12739	a380e9a7-a2da-4a8e-8ff8-367d53306528	\N	2025-07-11 19:45:20.848472+00	ENTREGUE	260.00	Dinheiro	Pedido de teste gerado por script.	Rua Domingos Barroso	65	\N	Monte Alverne	Paraipaba	CE	62685-000
ef0b7c2d-e770-4490-a9a7-229440588684	a380e9a7-a2da-4a8e-8ff8-367d53306528	\N	2025-07-19 03:15:33.783072+00	PENDENTE	145.00	Dinheiro	Pedido de teste gerado por script.	Avenida Maria Moreira	10	\N	Centro	Paraipaba	CE	62685-000
78a5f650-e7f6-4c2d-bf55-0c841e83b648	e3e53da3-58ec-4fff-a2fc-4fefb9bfc463	\N	2025-05-24 21:57:40.68974+00	ENTREGUE	40.00	Cartão de Crédito	Pedido de teste gerado por script.	Rua João Viana Pessoa	116	\N	Monte Alverne	Paraipaba	CE	62685-000
65641936-253a-47ee-a212-f21164eae9db	e3e53da3-58ec-4fff-a2fc-4fefb9bfc463	\N	2025-07-09 15:19:40.924926+00	PENDENTE	37.50	Cartão de Crédito	Pedido de teste gerado por script.	Avenida Maria Moreira	240	\N	Boa Esperança	Paraipaba	CE	62685-000
48e0ac35-1f04-4a8e-b323-fa565b28062e	e3e53da3-58ec-4fff-a2fc-4fefb9bfc463	\N	2025-05-27 08:55:35.210264+00	PENDENTE	225.00	PIX	Pedido de teste gerado por script.	Rua Domingos Barroso	122	\N	Lagoinha	Paraipaba	CE	62685-000
d5303209-6472-4832-a311-2435f4cd51fd	e3e53da3-58ec-4fff-a2fc-4fefb9bfc463	\N	2025-06-06 14:28:54.863542+00	ENVIADO	195.00	Cartão de Crédito	Pedido de teste gerado por script.	Avenida Maria Moreira	166	\N	Monte Alverne	Paraipaba	CE	62685-000
25754c04-802c-4609-a069-1269cdb071f1	e3e53da3-58ec-4fff-a2fc-4fefb9bfc463	\N	2025-07-18 13:13:54.278352+00	CANCELADO	215.00	Cartão de Crédito	Pedido de teste gerado por script.	Rua Domingos Barroso	159	\N	Lagoinha	Paraipaba	CE	62685-000
58caffaa-1fc7-4afa-b29c-47832e08717e	57f7ca19-54d3-4d13-abe0-4d3ab39cada3	\N	2025-05-31 01:19:39.46804+00	EM_PREPARO	255.00	PIX	Pedido de teste gerado por script.	Rua João Viana Pessoa	78	\N	Lagoinha	Paraipaba	CE	62685-000
062f8ceb-3022-452b-97ca-76a28771bc31	57f7ca19-54d3-4d13-abe0-4d3ab39cada3	\N	2025-06-07 19:43:48.271096+00	CANCELADO	275.00	Dinheiro	Pedido de teste gerado por script.	Rua João Viana Pessoa	106	\N	Loteamento	Paraipaba	CE	62685-000
9123ba3c-49ec-472a-83f7-d5f364611f7d	57f7ca19-54d3-4d13-abe0-4d3ab39cada3	\N	2025-06-11 02:13:27.63692+00	CANCELADO	55.00	Dinheiro	Pedido de teste gerado por script.	Avenida Maria Moreira	111	\N	Monte Alverne	Paraipaba	CE	62685-000
4a1bf15c-73c9-4d36-96d5-8083df12845d	57f7ca19-54d3-4d13-abe0-4d3ab39cada3	\N	2025-06-16 01:57:42.673892+00	EM_PREPARO	160.00	Cartão de Crédito	Pedido de teste gerado por script.	Rua João Viana Pessoa	293	\N	Centro	Paraipaba	CE	62685-000
2771c81e-8500-474c-a5be-61318f1381e5	57f7ca19-54d3-4d13-abe0-4d3ab39cada3	\N	2025-07-09 08:17:29.114609+00	EM_PREPARO	430.00	PIX	Pedido de teste gerado por script.	Rua Joaquim Braga	114	\N	Loteamento	Paraipaba	CE	62685-000
cb11c7e2-869a-4704-a486-9c94b1c77e0e	37b233f3-2891-4b39-b017-8724eaf63823	\N	2025-06-15 19:48:22.287692+00	CANCELADO	150.00	PIX	Pedido de teste gerado por script.	Rua João Viana Pessoa	172	\N	Monte Alverne	Paraipaba	CE	62685-000
9922fc1d-fd03-42ff-8898-c6cba20f66ef	37b233f3-2891-4b39-b017-8724eaf63823	\N	2025-06-15 07:00:15.555697+00	ENTREGUE	385.00	Cartão de Crédito	Pedido de teste gerado por script.	Avenida Maria Moreira	109	\N	Centro	Paraipaba	CE	62685-000
08fc3559-02ca-4db8-9714-23e34b29b416	37b233f3-2891-4b39-b017-8724eaf63823	\N	2025-05-26 16:00:44.555955+00	CANCELADO	175.00	PIX	Pedido de teste gerado por script.	Rua Domingos Barroso	232	\N	Centro	Paraipaba	CE	62685-000
639cb09c-e11b-4f68-adc2-7da5a9427597	37b233f3-2891-4b39-b017-8724eaf63823	\N	2025-05-30 13:24:00.971258+00	PENDENTE	95.00	Dinheiro	Pedido de teste gerado por script.	Rua João Viana Pessoa	191	\N	Loteamento	Paraipaba	CE	62685-000
66047465-b1d1-43ad-88c4-6ed391a42e01	37b233f3-2891-4b39-b017-8724eaf63823	\N	2025-06-10 09:31:45.103459+00	ENTREGUE	75.00	PIX	Pedido de teste gerado por script.	Rua Maria da Conceição Damasceno	124	\N	Centro	Paraipaba	CE	62685-000
45ba32d4-5a01-4ee8-bec4-e5596536239a	a9ec3f81-1920-46cf-908b-676349a9875e	\N	2025-06-26 20:14:50.843484+00	PENDENTE	480.00	Dinheiro	Pedido de teste gerado por script.	Rua Domingos Barroso	124	\N	Loteamento	Paraipaba	CE	62685-000
0a603a78-5e84-4c97-a942-a53a642ef4a0	a9ec3f81-1920-46cf-908b-676349a9875e	\N	2025-05-31 05:01:54.527366+00	ENTREGUE	385.00	Dinheiro	Pedido de teste gerado por script.	Rua Domingos Barroso	130	\N	Centro	Paraipaba	CE	62685-000
dcdb0892-081f-45ca-8127-0457b72e18b4	a9ec3f81-1920-46cf-908b-676349a9875e	\N	2025-07-19 20:13:35.914423+00	CANCELADO	105.00	Dinheiro	Pedido de teste gerado por script.	Rua João Viana Pessoa	91	\N	Monte Alverne	Paraipaba	CE	62685-000
5649d90e-e5c5-4c78-a9da-727f129b61b9	a9ec3f81-1920-46cf-908b-676349a9875e	\N	2025-05-29 16:28:46.985148+00	CANCELADO	235.00	Dinheiro	Pedido de teste gerado por script.	Rua Domingos Barroso	91	\N	Boa Esperança	Paraipaba	CE	62685-000
1ff3a189-6526-497c-85d6-4e82d2e048a6	a9ec3f81-1920-46cf-908b-676349a9875e	\N	2025-05-23 06:50:28.362377+00	ENVIADO	57.50	PIX	Pedido de teste gerado por script.	Rua João Viana Pessoa	136	\N	Loteamento	Paraipaba	CE	62685-000
\.


--
-- TOC entry 3440 (class 0 OID 16461)
-- Dependencies: 218
-- Data for Name: pedido_item; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.pedido_item (id, pedido_id, produto_id, quantidade, preco_unitario) FROM stdin;
d5354684-11b8-4f56-b6c7-2f7d0d10d4ce	a5b39503-24c3-47bf-93d8-d9de7e30f938	14a6a2d4-e11d-415a-91f4-2a0e4d2c6efa	1	180.00
9cfe0c79-5b15-47a3-bf00-99886dfd1586	a5b39503-24c3-47bf-93d8-d9de7e30f938	3ac8af2d-915e-49c4-a105-3bbcf1970708	2	70.00
355dc839-0e72-4146-9fab-689ecffc01e1	4fb6270c-31f4-4a94-aa01-846b2422478a	3ac8af2d-915e-49c4-a105-3bbcf1970708	1	70.00
74dcfd19-6a29-4317-ba55-c4b4b417e38b	4fb6270c-31f4-4a94-aa01-846b2422478a	7986f52f-3f6c-4387-83da-f651afe2a0df	2	85.00
414b7966-14a6-4d02-8812-edb332fd616e	537fefae-f8ab-4a9e-a77d-3d94d08f168b	6b425d81-8b15-40b3-b467-f4f8d1195274	1	35.00
cf8e09b3-2750-440d-a64b-c1090baba990	537fefae-f8ab-4a9e-a77d-3d94d08f168b	7986f52f-3f6c-4387-83da-f651afe2a0df	2	85.00
19556cc8-5845-4e9c-ad3d-569cd9711236	8db2ed35-0228-4ffa-9f85-e559360cf4d9	bbe2aa97-4824-49b3-89ef-370b938dba79	1	7.50
8ad1ae2b-c871-447f-96bb-6953db7128f5	8db2ed35-0228-4ffa-9f85-e559360cf4d9	b61d2e83-2095-4481-9f37-d846ef5d1cdf	2	15.00
0382d5a5-3943-46f7-a8bd-d25a95af9401	348eea5c-8c80-4c39-9637-e12364dfbab2	baddf794-bda9-4590-8c93-fada942d62f3	1	120.00
126f4052-675b-4ea9-b0d5-822ec52bb041	348eea5c-8c80-4c39-9637-e12364dfbab2	7986f52f-3f6c-4387-83da-f651afe2a0df	2	85.00
83d0f005-2d14-4625-961d-ea7bd764ea21	247143af-6879-46b3-8587-4d291838f036	6b425d81-8b15-40b3-b467-f4f8d1195274	1	35.00
d3c63eb4-0b64-4b32-a522-1a6f29bca05e	247143af-6879-46b3-8587-4d291838f036	068df678-478e-462e-bec2-e2039d58f85d	2	25.00
14a6ac78-6f96-46d0-affa-7645c661c506	5b54a307-1dc4-47c0-a261-8ea648a26a8b	3ac8af2d-915e-49c4-a105-3bbcf1970708	1	70.00
4c410922-0f80-4584-87f9-de66216ce4d7	5b54a307-1dc4-47c0-a261-8ea648a26a8b	068df678-478e-462e-bec2-e2039d58f85d	2	25.00
f5146628-e109-446d-92fe-80a41a53b751	a5526a4d-8997-4ffb-9b30-3e4dd5599a25	7986f52f-3f6c-4387-83da-f651afe2a0df	1	85.00
55f489ae-510f-4676-a463-467dd2013e5f	a5526a4d-8997-4ffb-9b30-3e4dd5599a25	3ac8af2d-915e-49c4-a105-3bbcf1970708	2	70.00
f4fc8ad1-79d3-4d5a-a5d9-5aef4b0cdbf7	7302887d-3f41-482c-8d6f-8a99f76f1927	5f592862-6766-45f0-80e3-6864f62062a5	1	45.00
178d2d22-8934-4d86-b7ea-fae2d182d535	7302887d-3f41-482c-8d6f-8a99f76f1927	14a6a2d4-e11d-415a-91f4-2a0e4d2c6efa	2	180.00
dc2f5af2-3d40-46d5-bb52-932d9176bee4	e63298c8-f795-4b66-8594-80ba16d758fc	bc3dbe0f-e53a-4581-89e2-4b2a2180bf59	1	95.00
d1e4122a-b04f-4d5b-9fda-c8fcad65260f	e63298c8-f795-4b66-8594-80ba16d758fc	baddf794-bda9-4590-8c93-fada942d62f3	2	120.00
c84b00ff-7970-4a3b-a36b-4acabf509103	48909338-ffd9-4537-9c94-cc0f3da8d1a4	bc3dbe0f-e53a-4581-89e2-4b2a2180bf59	1	95.00
042c458a-c6f0-4378-88ef-d38fc8a17de3	48909338-ffd9-4537-9c94-cc0f3da8d1a4	baddf794-bda9-4590-8c93-fada942d62f3	2	120.00
a51c5398-04a1-4984-a2a8-5f56795d2ed1	272048af-e43e-4d2f-b198-8443ec5db9d3	7986f52f-3f6c-4387-83da-f651afe2a0df	1	85.00
b0a3f71d-e5a4-4321-9274-7dd73df6262f	272048af-e43e-4d2f-b198-8443ec5db9d3	b61d2e83-2095-4481-9f37-d846ef5d1cdf	2	15.00
ebad67e9-7422-45e5-8e4e-337a33390bb5	5e6da38e-a097-43ac-860c-eabe0316323f	6b425d81-8b15-40b3-b467-f4f8d1195274	1	35.00
9a89cef6-b277-4474-8b7d-e0562c473d27	5e6da38e-a097-43ac-860c-eabe0316323f	7986f52f-3f6c-4387-83da-f651afe2a0df	2	85.00
7f4c7795-96e8-4f6f-9753-79730b73c6c2	0c5aa5f2-59d2-4e74-8c9d-f2feac5cc685	14a6a2d4-e11d-415a-91f4-2a0e4d2c6efa	1	180.00
d5a4da21-100c-48b8-9512-50c0d70aa7e8	0c5aa5f2-59d2-4e74-8c9d-f2feac5cc685	b61d2e83-2095-4481-9f37-d846ef5d1cdf	2	15.00
d876717a-e955-4c44-970d-c6bc4355f781	3705ace1-43e0-4ac0-b4cf-e5a4c494b4f3	bbe2aa97-4824-49b3-89ef-370b938dba79	1	7.50
102b7706-eab8-4a10-91fb-517865615b50	3705ace1-43e0-4ac0-b4cf-e5a4c494b4f3	14a6a2d4-e11d-415a-91f4-2a0e4d2c6efa	2	180.00
b214e45b-405b-45d7-acd1-f1695402e816	15a1ed08-13c6-4310-a881-ccbe8ce7fe00	bbe2aa97-4824-49b3-89ef-370b938dba79	1	7.50
34099b61-23a7-4b48-a74f-cff7a1e09e28	15a1ed08-13c6-4310-a881-ccbe8ce7fe00	14a6a2d4-e11d-415a-91f4-2a0e4d2c6efa	2	180.00
436cad10-484f-41f7-afc3-a6dd3104003f	15e211e3-a290-4f70-b718-ccd7d97bd8ef	b61d2e83-2095-4481-9f37-d846ef5d1cdf	1	15.00
8bfd9436-7287-46b3-839e-593965aa758f	15e211e3-a290-4f70-b718-ccd7d97bd8ef	3ac8af2d-915e-49c4-a105-3bbcf1970708	2	70.00
d4f7a883-adf8-4a95-a892-acb4a36cf6f2	a4a642ce-6014-4367-8e27-089a4fd91eea	bbe2aa97-4824-49b3-89ef-370b938dba79	1	7.50
b3dbb64a-cbb9-4112-a743-5e4cf17adad6	a4a642ce-6014-4367-8e27-089a4fd91eea	3ac8af2d-915e-49c4-a105-3bbcf1970708	2	70.00
ef0e3ef5-f544-4094-8e3a-077c0d77fdfb	06b0f9b5-c26b-412f-af70-8d18c1531e7f	068df678-478e-462e-bec2-e2039d58f85d	1	25.00
f599e526-375e-4442-a0d8-9f938a2a28ea	06b0f9b5-c26b-412f-af70-8d18c1531e7f	baddf794-bda9-4590-8c93-fada942d62f3	2	120.00
6b90ca58-bde3-42fe-b0a1-3ac2d06d85d8	56f21b31-93e9-4763-a87a-28e4cacae339	6b425d81-8b15-40b3-b467-f4f8d1195274	1	35.00
80baae04-efce-4ddd-a667-a83955b003f5	56f21b31-93e9-4763-a87a-28e4cacae339	bbe2aa97-4824-49b3-89ef-370b938dba79	2	7.50
bf7f968f-7337-4e8f-a019-db13ea3c1eac	09f467e2-ab25-4f26-b29c-ed2431791f13	baddf794-bda9-4590-8c93-fada942d62f3	1	120.00
ed850eb1-4fe1-4f9b-9156-a12b9eac24b8	09f467e2-ab25-4f26-b29c-ed2431791f13	bbe2aa97-4824-49b3-89ef-370b938dba79	2	7.50
1aaee929-8a53-4b91-a7d0-d1044f5cf9f0	19be3216-6f30-4ab5-9d63-baf4aa39a16b	b61d2e83-2095-4481-9f37-d846ef5d1cdf	1	15.00
e376f365-9ad3-4609-9a05-be3e6c7d0584	19be3216-6f30-4ab5-9d63-baf4aa39a16b	3ac8af2d-915e-49c4-a105-3bbcf1970708	2	70.00
0678ac9d-96b2-471c-9116-0b6e606d0c68	10f20d22-31fc-4719-9979-f33fede14368	bbe2aa97-4824-49b3-89ef-370b938dba79	1	7.50
ea18620e-8144-4c8e-abd2-81081274cd8c	10f20d22-31fc-4719-9979-f33fede14368	5f592862-6766-45f0-80e3-6864f62062a5	2	45.00
cde0a91b-56d6-4efc-b54b-cf78e0bc6a9d	8c3a1141-4b94-4402-8fa0-bda4063557bc	bc3dbe0f-e53a-4581-89e2-4b2a2180bf59	1	95.00
8140d8ed-4ad0-44ad-8981-1cad5f458600	8c3a1141-4b94-4402-8fa0-bda4063557bc	6b425d81-8b15-40b3-b467-f4f8d1195274	2	35.00
39a1c714-82f9-4b91-b91b-01f73610136e	2c13576d-039a-4d5c-adf8-828e0d0f1c6a	068df678-478e-462e-bec2-e2039d58f85d	1	25.00
73723ab7-625c-4e52-a3a0-c9970548359f	2c13576d-039a-4d5c-adf8-828e0d0f1c6a	bc3dbe0f-e53a-4581-89e2-4b2a2180bf59	2	95.00
d0e2e2d4-9b4c-43b7-b6ad-2b39c5007111	9a1ab431-5879-456b-bda9-31ebd8a1318a	5f592862-6766-45f0-80e3-6864f62062a5	1	45.00
39d82ed2-7efc-437d-8852-6e2c3ba98bfb	9a1ab431-5879-456b-bda9-31ebd8a1318a	b61d2e83-2095-4481-9f37-d846ef5d1cdf	2	15.00
72e47712-b8bf-4d22-a746-0b2fd6db9efc	16cea872-e8a1-4d83-8e34-dd0b2b585e06	bbe2aa97-4824-49b3-89ef-370b938dba79	1	7.50
59cc3f0e-7820-4087-9b53-7f715cfd3516	16cea872-e8a1-4d83-8e34-dd0b2b585e06	14a6a2d4-e11d-415a-91f4-2a0e4d2c6efa	2	180.00
b96ce00b-a3b5-48c6-ae02-7db5276f95de	c08120b9-4e1a-4021-9349-917d55b32421	3ac8af2d-915e-49c4-a105-3bbcf1970708	1	70.00
5bb96e73-b7eb-4db5-91a7-8dc326cbb7a2	c08120b9-4e1a-4021-9349-917d55b32421	baddf794-bda9-4590-8c93-fada942d62f3	2	120.00
d24866d0-29cf-4ba3-aec1-072807003a97	c014d767-38f6-49a7-91a9-2513d9a12739	baddf794-bda9-4590-8c93-fada942d62f3	1	120.00
1e517539-5f7b-46f2-ad19-5130fe122e5e	c014d767-38f6-49a7-91a9-2513d9a12739	3ac8af2d-915e-49c4-a105-3bbcf1970708	2	70.00
218ba7b8-e987-4aa2-ad8a-d304710e97e1	ef0b7c2d-e770-4490-a9a7-229440588684	bc3dbe0f-e53a-4581-89e2-4b2a2180bf59	1	95.00
a4eb4544-1769-4ef9-a409-806df176f966	ef0b7c2d-e770-4490-a9a7-229440588684	068df678-478e-462e-bec2-e2039d58f85d	2	25.00
c75bc476-d9dc-4801-8164-4e7719b3d4a5	78a5f650-e7f6-4c2d-bf55-0c841e83b648	068df678-478e-462e-bec2-e2039d58f85d	1	25.00
a8a99c43-b381-48b2-b8b4-e5574c523210	78a5f650-e7f6-4c2d-bf55-0c841e83b648	bbe2aa97-4824-49b3-89ef-370b938dba79	2	7.50
fa7274a4-c545-4be1-a498-138152f78a98	65641936-253a-47ee-a212-f21164eae9db	bbe2aa97-4824-49b3-89ef-370b938dba79	1	7.50
ca23eaea-7194-4625-9ac9-5a1e4594620e	65641936-253a-47ee-a212-f21164eae9db	b61d2e83-2095-4481-9f37-d846ef5d1cdf	2	15.00
dd29ddb2-66a3-4890-8c68-f9a7bf34af5b	48e0ac35-1f04-4a8e-b323-fa565b28062e	6b425d81-8b15-40b3-b467-f4f8d1195274	1	35.00
a3d8fb44-52af-4eef-ba35-150b91a1d30e	48e0ac35-1f04-4a8e-b323-fa565b28062e	bc3dbe0f-e53a-4581-89e2-4b2a2180bf59	2	95.00
ee9155cf-6830-4101-a248-7117d43980e3	d5303209-6472-4832-a311-2435f4cd51fd	068df678-478e-462e-bec2-e2039d58f85d	1	25.00
4138568c-14f9-4a76-94e7-74f84f808ffd	d5303209-6472-4832-a311-2435f4cd51fd	7986f52f-3f6c-4387-83da-f651afe2a0df	2	85.00
11f09f8a-360d-4a58-86a9-68c2d65309fa	25754c04-802c-4609-a069-1269cdb071f1	5f592862-6766-45f0-80e3-6864f62062a5	1	45.00
60ef44ba-bb21-4b86-939b-980bf5de3673	25754c04-802c-4609-a069-1269cdb071f1	7986f52f-3f6c-4387-83da-f651afe2a0df	2	85.00
341e1f29-3aae-4be5-9a27-cc5a56b352a4	58caffaa-1fc7-4afa-b29c-47832e08717e	b61d2e83-2095-4481-9f37-d846ef5d1cdf	1	15.00
e29ffa18-d01a-499a-8055-c9013a0abbb2	58caffaa-1fc7-4afa-b29c-47832e08717e	baddf794-bda9-4590-8c93-fada942d62f3	2	120.00
ee1131a7-ebd1-4278-b039-29af1b2bac6e	062f8ceb-3022-452b-97ca-76a28771bc31	7986f52f-3f6c-4387-83da-f651afe2a0df	1	85.00
0c50d212-b145-4b46-952f-3c7d2d845cbc	062f8ceb-3022-452b-97ca-76a28771bc31	bc3dbe0f-e53a-4581-89e2-4b2a2180bf59	2	95.00
2c9c385c-48c9-47c7-aafc-d574bf3b287b	9123ba3c-49ec-472a-83f7-d5f364611f7d	068df678-478e-462e-bec2-e2039d58f85d	1	25.00
fa504c1e-2231-4d6b-ac8c-719a999ea276	9123ba3c-49ec-472a-83f7-d5f364611f7d	b61d2e83-2095-4481-9f37-d846ef5d1cdf	2	15.00
67498738-f6bc-4a0d-adda-b0ce498e2272	4a1bf15c-73c9-4d36-96d5-8083df12845d	3ac8af2d-915e-49c4-a105-3bbcf1970708	1	70.00
ac9b5956-76a6-4329-8837-50481f865f59	4a1bf15c-73c9-4d36-96d5-8083df12845d	5f592862-6766-45f0-80e3-6864f62062a5	2	45.00
43df7c9c-7e50-4666-a49a-f061f0886dd0	2771c81e-8500-474c-a5be-61318f1381e5	3ac8af2d-915e-49c4-a105-3bbcf1970708	1	70.00
f54ef69a-0da8-4cc0-8f22-6291b6d39538	2771c81e-8500-474c-a5be-61318f1381e5	14a6a2d4-e11d-415a-91f4-2a0e4d2c6efa	2	180.00
1b4af354-f3ec-480b-9a45-633e14a2330f	cb11c7e2-869a-4704-a486-9c94b1c77e0e	baddf794-bda9-4590-8c93-fada942d62f3	1	120.00
5d5eaae6-7f78-4d7e-a4ca-9c8a4c40dbad	cb11c7e2-869a-4704-a486-9c94b1c77e0e	b61d2e83-2095-4481-9f37-d846ef5d1cdf	2	15.00
7e6faf62-75e0-4aac-8229-4a7c44956758	9922fc1d-fd03-42ff-8898-c6cba20f66ef	068df678-478e-462e-bec2-e2039d58f85d	1	25.00
ccdce185-231f-4ebc-8167-0c695fb4e000	9922fc1d-fd03-42ff-8898-c6cba20f66ef	14a6a2d4-e11d-415a-91f4-2a0e4d2c6efa	2	180.00
4235b425-6f13-4a18-8aa0-0a67ab022319	08fc3559-02ca-4db8-9714-23e34b29b416	6b425d81-8b15-40b3-b467-f4f8d1195274	1	35.00
f33b412b-c863-4bca-943e-ae229a072870	08fc3559-02ca-4db8-9714-23e34b29b416	3ac8af2d-915e-49c4-a105-3bbcf1970708	2	70.00
cbbf85ae-6539-46c9-bc28-1629bcfd8c78	639cb09c-e11b-4f68-adc2-7da5a9427597	068df678-478e-462e-bec2-e2039d58f85d	1	25.00
49cec6b4-982b-43ae-aeb8-62cb0a783de8	639cb09c-e11b-4f68-adc2-7da5a9427597	6b425d81-8b15-40b3-b467-f4f8d1195274	2	35.00
ec412566-f330-4296-bf05-1b1257bc3a6e	66047465-b1d1-43ad-88c4-6ed391a42e01	5f592862-6766-45f0-80e3-6864f62062a5	1	45.00
1efef0dc-8a8a-4b33-8428-e67923df3b59	66047465-b1d1-43ad-88c4-6ed391a42e01	b61d2e83-2095-4481-9f37-d846ef5d1cdf	2	15.00
e98b173d-7e58-449e-9259-f30008a5a9f1	45ba32d4-5a01-4ee8-bec4-e5596536239a	baddf794-bda9-4590-8c93-fada942d62f3	1	120.00
f9f921ac-416d-43dd-859d-801beea88fc6	45ba32d4-5a01-4ee8-bec4-e5596536239a	14a6a2d4-e11d-415a-91f4-2a0e4d2c6efa	2	180.00
a6e8ad3d-df2f-4047-80ad-318ff0eedb14	0a603a78-5e84-4c97-a942-a53a642ef4a0	068df678-478e-462e-bec2-e2039d58f85d	1	25.00
aa90bd60-80e0-4dff-8a8b-b1aa4930eeb3	0a603a78-5e84-4c97-a942-a53a642ef4a0	14a6a2d4-e11d-415a-91f4-2a0e4d2c6efa	2	180.00
16156afe-3b6b-4b6f-af3f-46ad39555359	dcdb0892-081f-45ca-8127-0457b72e18b4	b61d2e83-2095-4481-9f37-d846ef5d1cdf	1	15.00
18265fc3-4a9d-43b6-bb94-dcf384515b44	dcdb0892-081f-45ca-8127-0457b72e18b4	5f592862-6766-45f0-80e3-6864f62062a5	2	45.00
40f1678e-7b0c-40e1-bc45-460109d9ff97	5649d90e-e5c5-4c78-a9da-727f129b61b9	bc3dbe0f-e53a-4581-89e2-4b2a2180bf59	1	95.00
68cfb4dc-be73-420c-9b5c-e755f36668fd	5649d90e-e5c5-4c78-a9da-727f129b61b9	3ac8af2d-915e-49c4-a105-3bbcf1970708	2	70.00
317c684a-e9a0-4d22-804c-cdbc5878009b	1ff3a189-6526-497c-85d6-4e82d2e048a6	bbe2aa97-4824-49b3-89ef-370b938dba79	1	7.50
6acb0d71-2e6f-4aaa-912a-ea1377d326b3	1ff3a189-6526-497c-85d6-4e82d2e048a6	068df678-478e-462e-bec2-e2039d58f85d	2	25.00
\.


--
-- TOC entry 3438 (class 0 OID 16429)
-- Dependencies: 216
-- Data for Name: produto; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.produto (id, nome, descricao, preco, quantidade, imagem_url, ativo, imagem) FROM stdin;
7986f52f-3f6c-4387-83da-f651afe2a0df	Buquê de Rosas Coloridas	12 rosas de cores variadas.	85.00	20	\N	t	2e16140f-9358-4b28-9afe-0e5d1b3ec946_premium_photo-1703631158408-6f6d3f984de3.jpg
baddf794-bda9-4590-8c93-fada942d62f3	Orquídea Phalaenopsis Branca	Orquídea elegante em vaso de vidro.	120.00	15	\N	t	c434f2fa-34ac-42dc-a0b4-33fca6b4d3fb_premium_photo-1677665881484-eda66d311385.jpg
068df678-478e-462e-bec2-e2039d58f85d	Lírio Branco	Lírios brancos que simbolizam a paz.	25.00	50	\N	t	76890f12-8ad5-4801-be9b-5418478f66a5_photo-1622028623244-33a608181f83.jpg
b61d2e83-2095-4481-9f37-d846ef5d1cdf	Suculenta Echeveria	Suculenta em formato de flor.	15.00	80	\N	t	8d035df5-e94b-446d-8af1-a572d42a9def_Suculenta-echeveria-Gila-e1660644318158-256475159.jpg
6b425d81-8b15-40b3-b467-f4f8d1195274	Cacto Mandacaru Pequeno	Cacto resistente e de fácil cuidado.	35.00	40	\N	t	cca292e7-ff3b-4e4d-839b-715062896c2a_como-plantar-cacto-mandacaru-03-11-3615298629.jpg
5f592862-6766-45f0-80e3-6864f62062a5	Girassol em Vaso	Lindo girassol para alegrar o ambiente.	45.00	30	\N	t	ee8f663e-ba90-4f9f-a059-d5e71dc9e9c2_Google_AI_Studio_2025-07-22T01_56_52.712Z.png
14a6a2d4-e11d-415a-91f4-2a0e4d2c6efa	Cesta de Café da Manhã	Cesta completa com pães, frutas e frios.	180.00	0	\N	f	\N
3ac8af2d-915e-49c4-a105-3bbcf1970708	Arranjo de Flores do Campo	Mix de flores do campo frescas.	70.00	0	\N	t	\N
bbe2aa97-4824-49b3-89ef-370b938dba79	Rosa Vermelha (Unidade)	Clássica rosa vermelha para presentear.	7.50	13	\N	t	e622582b-b4fc-460f-9727-25e2cf0e30a0_edward-howell-dZ3YRMco4XU-unsplash.jpg
bc3dbe0f-e53a-4581-89e2-4b2a2180bf59	Vaso de Tulipas Amarelas	Tulipas vibrantes para a primavera.	95.00	21	\N	t	6c4f981d-6039-4568-b84c-53d000c5e9d0_Google_AI_Studio_2025-07-22T01_52_29.498Z.png
\.


--
-- TOC entry 3442 (class 0 OID 16498)
-- Dependencies: 220
-- Data for Name: token_recuperacao_senha; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.token_recuperacao_senha (id, token, usuario_id, cliente_id, data_expiracao) FROM stdin;
\.


--
-- TOC entry 3436 (class 0 OID 16405)
-- Dependencies: 214
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.usuario (id, nome, email, telefone, cargo, senha, ativo) FROM stdin;
1d597886-eb5d-4eef-b3ba-e46cb99be88d	Gabriel Alves	gerente@email.com	(85) 99999-0001	GERENTE	$2a$10$mWQ.NXQfWrog0Nria99v3uUWwCc0cjJsdQLs2HRHLuAeVjHjD7x3q	t
91f643d6-228a-49ee-85de-0b58cce766d3	Tiago Tito	vendedor@email.com	(85) 99999-0002	VENDEDOR	$2a$10$mWQ.NXQfWrog0Nria99v3uUWwCc0cjJsdQLs2HRHLuAeVjHjD7x3q	t
\.


--
-- TOC entry 3275 (class 2606 OID 16487)
-- Name: carrinho_item carrinho_item_cliente_id_produto_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.carrinho_item
    ADD CONSTRAINT carrinho_item_cliente_id_produto_id_key UNIQUE (cliente_id, produto_id);


--
-- TOC entry 3277 (class 2606 OID 16485)
-- Name: carrinho_item carrinho_item_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.carrinho_item
    ADD CONSTRAINT carrinho_item_pkey PRIMARY KEY (id);


--
-- TOC entry 3259 (class 2606 OID 16538)
-- Name: cliente cliente_cpf_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_cpf_cnpj_key UNIQUE (cpf_cnpj);


--
-- TOC entry 3261 (class 2606 OID 16426)
-- Name: cliente cliente_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_email_key UNIQUE (email);


--
-- TOC entry 3263 (class 2606 OID 16424)
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id);


--
-- TOC entry 3284 (class 2606 OID 16526)
-- Name: notificacao notificacao_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notificacao
    ADD CONSTRAINT notificacao_pkey PRIMARY KEY (id);


--
-- TOC entry 3273 (class 2606 OID 16467)
-- Name: pedido_item pedido_item_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pedido_item
    ADD CONSTRAINT pedido_item_pkey PRIMARY KEY (id);


--
-- TOC entry 3271 (class 2606 OID 16450)
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (id);


--
-- TOC entry 3267 (class 2606 OID 16440)
-- Name: produto produto_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.produto
    ADD CONSTRAINT produto_pkey PRIMARY KEY (id);


--
-- TOC entry 3279 (class 2606 OID 16504)
-- Name: token_recuperacao_senha token_recuperacao_senha_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.token_recuperacao_senha
    ADD CONSTRAINT token_recuperacao_senha_pkey PRIMARY KEY (id);


--
-- TOC entry 3281 (class 2606 OID 16506)
-- Name: token_recuperacao_senha token_recuperacao_senha_token_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.token_recuperacao_senha
    ADD CONSTRAINT token_recuperacao_senha_token_key UNIQUE (token);


--
-- TOC entry 3255 (class 2606 OID 16415)
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- TOC entry 3257 (class 2606 OID 16413)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 3264 (class 1259 OID 16535)
-- Name: idx_cliente_ativo; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_cliente_ativo ON public.cliente USING btree (ativo);


--
-- TOC entry 3282 (class 1259 OID 16536)
-- Name: idx_notificacao_destinatario; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_notificacao_destinatario ON public.notificacao USING btree (destinatario_id);


--
-- TOC entry 3268 (class 1259 OID 16532)
-- Name: idx_pedido_cliente_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_pedido_cliente_id ON public.pedido USING btree (cliente_id);


--
-- TOC entry 3269 (class 1259 OID 16547)
-- Name: idx_pedido_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_pedido_status ON public.pedido USING btree (status);


--
-- TOC entry 3265 (class 1259 OID 16534)
-- Name: idx_produto_ativo; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_produto_ativo ON public.produto USING btree (ativo);


--
-- TOC entry 3289 (class 2606 OID 16488)
-- Name: carrinho_item carrinho_item_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.carrinho_item
    ADD CONSTRAINT carrinho_item_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.cliente(id) ON DELETE CASCADE;


--
-- TOC entry 3290 (class 2606 OID 16493)
-- Name: carrinho_item carrinho_item_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.carrinho_item
    ADD CONSTRAINT carrinho_item_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produto(id) ON DELETE CASCADE;


--
-- TOC entry 3293 (class 2606 OID 16527)
-- Name: notificacao notificacao_destinatario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notificacao
    ADD CONSTRAINT notificacao_destinatario_id_fkey FOREIGN KEY (destinatario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 3285 (class 2606 OID 16451)
-- Name: pedido pedido_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.cliente(id);


--
-- TOC entry 3287 (class 2606 OID 16468)
-- Name: pedido_item pedido_item_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pedido_item
    ADD CONSTRAINT pedido_item_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedido(id) ON DELETE CASCADE;


--
-- TOC entry 3288 (class 2606 OID 16473)
-- Name: pedido_item pedido_item_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pedido_item
    ADD CONSTRAINT pedido_item_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produto(id) ON DELETE RESTRICT;


--
-- TOC entry 3286 (class 2606 OID 16456)
-- Name: pedido pedido_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- TOC entry 3291 (class 2606 OID 16512)
-- Name: token_recuperacao_senha token_recuperacao_senha_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.token_recuperacao_senha
    ADD CONSTRAINT token_recuperacao_senha_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.cliente(id) ON DELETE CASCADE;


--
-- TOC entry 3292 (class 2606 OID 16507)
-- Name: token_recuperacao_senha token_recuperacao_senha_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.token_recuperacao_senha
    ADD CONSTRAINT token_recuperacao_senha_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


-- Completed on 2025-07-22 02:30:28 UTC

--
-- PostgreSQL database dump complete
--

