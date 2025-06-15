--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

-- Started on 2025-06-12 19:33:55 UTC

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 229 (class 1259 OID 16500)
-- Name: Carrinho; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Carrinho" (
    id_carrinho integer NOT NULL,
    id_cliente integer NOT NULL,
    id_produto integer NOT NULL,
    quantidade integer NOT NULL,
    CONSTRAINT "Carrinho_quantidade_check" CHECK ((quantidade > 0))
);


ALTER TABLE public."Carrinho" OWNER TO admin;

--
-- TOC entry 228 (class 1259 OID 16499)
-- Name: Carrinho_id_carrinho_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Carrinho_id_carrinho_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Carrinho_id_carrinho_seq" OWNER TO admin;

--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 228
-- Name: Carrinho_id_carrinho_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Carrinho_id_carrinho_seq" OWNED BY public."Carrinho".id_carrinho;


--
-- TOC entry 218 (class 1259 OID 16403)
-- Name: Categoria; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Categoria" (
    id_categoria integer NOT NULL,
    nome character varying(100) NOT NULL
);


ALTER TABLE public."Categoria" OWNER TO admin;

--
-- TOC entry 217 (class 1259 OID 16402)
-- Name: Categoria_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Categoria_id_categoria_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Categoria_id_categoria_seq" OWNER TO admin;

--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 217
-- Name: Categoria_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Categoria_id_categoria_seq" OWNED BY public."Categoria".id_categoria;


--
-- TOC entry 222 (class 1259 OID 16431)
-- Name: Cliente; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Cliente" (
    id_cliente integer NOT NULL,
    nome character varying(255) NOT NULL,
    email character varying(255),
    telefone character varying(20),
    cpf_cnpj character varying(20),
    senha character varying(255),
    ativo boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Cliente" OWNER TO admin;

--
-- TOC entry 221 (class 1259 OID 16430)
-- Name: Cliente_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Cliente_id_cliente_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Cliente_id_cliente_seq" OWNER TO admin;

--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 221
-- Name: Cliente_id_cliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Cliente_id_cliente_seq" OWNED BY public."Cliente".id_cliente;


--
-- TOC entry 224 (class 1259 OID 16445)
-- Name: Endereco; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Endereco" (
    id_endereco integer NOT NULL,
    cep character varying(10),
    rua character varying(255),
    numero character varying(20),
    bairro character varying(100),
    cidade character varying(100),
    estado character varying(50),
    complemento character varying(255),
    id_cliente integer NOT NULL
);


ALTER TABLE public."Endereco" OWNER TO admin;

--
-- TOC entry 223 (class 1259 OID 16444)
-- Name: Endereco_id_endereco_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Endereco_id_endereco_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Endereco_id_endereco_seq" OWNER TO admin;

--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 223
-- Name: Endereco_id_endereco_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Endereco_id_endereco_seq" OWNED BY public."Endereco".id_endereco;


--
-- TOC entry 227 (class 1259 OID 16481)
-- Name: ItemPedido; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."ItemPedido" (
    id_item_pedido integer NOT NULL,
    id_pedido uuid NOT NULL,
    id_produto integer NOT NULL,
    quantidade integer NOT NULL,
    preco_unitario numeric(10,2) NOT NULL,
    CONSTRAINT "ItemPedido_preco_unitario_check" CHECK ((preco_unitario >= (0)::numeric)),
    CONSTRAINT "ItemPedido_quantidade_check" CHECK ((quantidade > 0))
);


ALTER TABLE public."ItemPedido" OWNER TO admin;

--
-- TOC entry 226 (class 1259 OID 16480)
-- Name: ItemPedido_id_item_pedido_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."ItemPedido_id_item_pedido_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ItemPedido_id_item_pedido_seq" OWNER TO admin;

--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 226
-- Name: ItemPedido_id_item_pedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."ItemPedido_id_item_pedido_seq" OWNED BY public."ItemPedido".id_item_pedido;


--
-- TOC entry 225 (class 1259 OID 16458)
-- Name: Pedido; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Pedido" (
    id_pedido uuid DEFAULT gen_random_uuid() NOT NULL,
    id_cliente integer,
    id_vendedor integer,
    valor_total numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'PENDENTE'::character varying NOT NULL,
    forma_pagamento character varying(50),
    observacoes text,
    data_pedido timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "Pedido_status_check" CHECK (((status)::text = ANY ((ARRAY['PENDENTE'::character varying, 'CANCELADO'::character varying, 'EM_PREPARO'::character varying, 'ENVIADO'::character varying])::text[]))),
    CONSTRAINT "Pedido_valor_total_check" CHECK ((valor_total >= (0)::numeric))
);


ALTER TABLE public."Pedido" OWNER TO admin;

--
-- TOC entry 220 (class 1259 OID 16412)
-- Name: Produto; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Produto" (
    id_produto integer NOT NULL,
    nome character varying(255) NOT NULL,
    descricao text,
    preco numeric(10,2) NOT NULL,
    preco_revenda numeric(10,2),
    quantidade integer DEFAULT 0 NOT NULL,
    imagem character varying(500),
    id_categoria integer,
    ativo boolean DEFAULT true NOT NULL,
    CONSTRAINT "Produto_preco_check" CHECK ((preco >= (0)::numeric)),
    CONSTRAINT "Produto_preco_revenda_check" CHECK ((preco_revenda >= (0)::numeric)),
    CONSTRAINT "Produto_quantidade_check" CHECK ((quantidade >= 0))
);


ALTER TABLE public."Produto" OWNER TO admin;

--
-- TOC entry 219 (class 1259 OID 16411)
-- Name: Produto_id_produto_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Produto_id_produto_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Produto_id_produto_seq" OWNER TO admin;

--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 219
-- Name: Produto_id_produto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Produto_id_produto_seq" OWNED BY public."Produto".id_produto;


--
-- TOC entry 216 (class 1259 OID 16390)
-- Name: Usuario; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."Usuario" (
    id_usuario integer NOT NULL,
    nome character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    telefone character varying(20),
    cargo character varying(20) NOT NULL,
    senha character varying(255) NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    CONSTRAINT "Usuario_cargo_check" CHECK (((cargo)::text = ANY ((ARRAY['GERENTE'::character varying, 'VENDEDOR'::character varying])::text[])))
);


ALTER TABLE public."Usuario" OWNER TO admin;

--
-- TOC entry 215 (class 1259 OID 16389)
-- Name: Usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Usuario_id_usuario_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Usuario_id_usuario_seq" OWNER TO admin;

--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 215
-- Name: Usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Usuario_id_usuario_seq" OWNED BY public."Usuario".id_usuario;


--
-- TOC entry 3311 (class 2604 OID 16503)
-- Name: Carrinho id_carrinho; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Carrinho" ALTER COLUMN id_carrinho SET DEFAULT nextval('public."Carrinho_id_carrinho_seq"'::regclass);


--
-- TOC entry 3300 (class 2604 OID 16406)
-- Name: Categoria id_categoria; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Categoria" ALTER COLUMN id_categoria SET DEFAULT nextval('public."Categoria_id_categoria_seq"'::regclass);


--
-- TOC entry 3304 (class 2604 OID 16434)
-- Name: Cliente id_cliente; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Cliente" ALTER COLUMN id_cliente SET DEFAULT nextval('public."Cliente_id_cliente_seq"'::regclass);


--
-- TOC entry 3306 (class 2604 OID 16448)
-- Name: Endereco id_endereco; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Endereco" ALTER COLUMN id_endereco SET DEFAULT nextval('public."Endereco_id_endereco_seq"'::regclass);


--
-- TOC entry 3310 (class 2604 OID 16484)
-- Name: ItemPedido id_item_pedido; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ItemPedido" ALTER COLUMN id_item_pedido SET DEFAULT nextval('public."ItemPedido_id_item_pedido_seq"'::regclass);


--
-- TOC entry 3301 (class 2604 OID 16415)
-- Name: Produto id_produto; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Produto" ALTER COLUMN id_produto SET DEFAULT nextval('public."Produto_id_produto_seq"'::regclass);


--
-- TOC entry 3298 (class 2604 OID 16393)
-- Name: Usuario id_usuario; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Usuario" ALTER COLUMN id_usuario SET DEFAULT nextval('public."Usuario_id_usuario_seq"'::regclass);


--
-- TOC entry 3519 (class 0 OID 16500)
-- Dependencies: 229
-- Data for Name: Carrinho; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Carrinho" (id_carrinho, id_cliente, id_produto, quantidade) FROM stdin;
\.


--
-- TOC entry 3508 (class 0 OID 16403)
-- Dependencies: 218
-- Data for Name: Categoria; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Categoria" (id_categoria, nome) FROM stdin;
1	Flores
2	Vasos
3	Plantas
4	Acessórios
\.


--
-- TOC entry 3512 (class 0 OID 16431)
-- Dependencies: 222
-- Data for Name: Cliente; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Cliente" (id_cliente, nome, email, telefone, cpf_cnpj, senha, ativo) FROM stdin;
\.


--
-- TOC entry 3514 (class 0 OID 16445)
-- Dependencies: 224
-- Data for Name: Endereco; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Endereco" (id_endereco, cep, rua, numero, bairro, cidade, estado, complemento, id_cliente) FROM stdin;
\.


--
-- TOC entry 3517 (class 0 OID 16481)
-- Dependencies: 227
-- Data for Name: ItemPedido; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."ItemPedido" (id_item_pedido, id_pedido, id_produto, quantidade, preco_unitario) FROM stdin;
\.


--
-- TOC entry 3515 (class 0 OID 16458)
-- Dependencies: 225
-- Data for Name: Pedido; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Pedido" (id_pedido, id_cliente, id_vendedor, valor_total, status, forma_pagamento, observacoes, data_pedido) FROM stdin;
\.


--
-- TOC entry 3510 (class 0 OID 16412)
-- Dependencies: 220
-- Data for Name: Produto; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Produto" (id_produto, nome, descricao, preco, preco_revenda, quantidade, imagem, id_categoria, ativo) FROM stdin;
\.


--
-- TOC entry 3506 (class 0 OID 16390)
-- Dependencies: 216
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."Usuario" (id_usuario, nome, email, telefone, cargo, senha, ativo) FROM stdin;
1	Administrador	admin@recantodaspalmerias.com	\N	GERENTE	senha_forte_hash	t
\.


--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 228
-- Name: Carrinho_id_carrinho_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Carrinho_id_carrinho_seq"', 1, false);


--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 217
-- Name: Categoria_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Categoria_id_categoria_seq"', 4, true);


--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 221
-- Name: Cliente_id_cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Cliente_id_cliente_seq"', 1, false);


--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 223
-- Name: Endereco_id_endereco_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Endereco_id_endereco_seq"', 1, false);


--
-- TOC entry 3536 (class 0 OID 0)
-- Dependencies: 226
-- Name: ItemPedido_id_item_pedido_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."ItemPedido_id_item_pedido_seq"', 1, false);


--
-- TOC entry 3537 (class 0 OID 0)
-- Dependencies: 219
-- Name: Produto_id_produto_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Produto_id_produto_seq"', 1, false);


--
-- TOC entry 3538 (class 0 OID 0)
-- Dependencies: 215
-- Name: Usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Usuario_id_usuario_seq"', 1, true);


--
-- TOC entry 3351 (class 2606 OID 16508)
-- Name: Carrinho Carrinho_id_cliente_id_produto_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Carrinho"
    ADD CONSTRAINT "Carrinho_id_cliente_id_produto_key" UNIQUE (id_cliente, id_produto);


--
-- TOC entry 3353 (class 2606 OID 16506)
-- Name: Carrinho Carrinho_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Carrinho"
    ADD CONSTRAINT "Carrinho_pkey" PRIMARY KEY (id_carrinho);


--
-- TOC entry 3326 (class 2606 OID 16410)
-- Name: Categoria Categoria_nome_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Categoria"
    ADD CONSTRAINT "Categoria_nome_key" UNIQUE (nome);


--
-- TOC entry 3328 (class 2606 OID 16408)
-- Name: Categoria Categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Categoria"
    ADD CONSTRAINT "Categoria_pkey" PRIMARY KEY (id_categoria);


--
-- TOC entry 3334 (class 2606 OID 16443)
-- Name: Cliente Cliente_cpf_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Cliente"
    ADD CONSTRAINT "Cliente_cpf_cnpj_key" UNIQUE (cpf_cnpj);


--
-- TOC entry 3336 (class 2606 OID 16441)
-- Name: Cliente Cliente_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Cliente"
    ADD CONSTRAINT "Cliente_email_key" UNIQUE (email);


--
-- TOC entry 3338 (class 2606 OID 16439)
-- Name: Cliente Cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Cliente"
    ADD CONSTRAINT "Cliente_pkey" PRIMARY KEY (id_cliente);


--
-- TOC entry 3342 (class 2606 OID 16452)
-- Name: Endereco Endereco_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Endereco"
    ADD CONSTRAINT "Endereco_pkey" PRIMARY KEY (id_endereco);


--
-- TOC entry 3349 (class 2606 OID 16488)
-- Name: ItemPedido ItemPedido_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ItemPedido"
    ADD CONSTRAINT "ItemPedido_pkey" PRIMARY KEY (id_item_pedido);


--
-- TOC entry 3344 (class 2606 OID 16469)
-- Name: Pedido Pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Pedido"
    ADD CONSTRAINT "Pedido_pkey" PRIMARY KEY (id_pedido);


--
-- TOC entry 3330 (class 2606 OID 16424)
-- Name: Produto Produto_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Produto"
    ADD CONSTRAINT "Produto_pkey" PRIMARY KEY (id_produto);


--
-- TOC entry 3322 (class 2606 OID 16401)
-- Name: Usuario Usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_email_key" UNIQUE (email);


--
-- TOC entry 3324 (class 2606 OID 16399)
-- Name: Usuario Usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY (id_usuario);


--
-- TOC entry 3339 (class 1259 OID 16522)
-- Name: idx_cliente_cpf_cnpj; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_cliente_cpf_cnpj ON public."Cliente" USING btree (cpf_cnpj);


--
-- TOC entry 3340 (class 1259 OID 16521)
-- Name: idx_cliente_email; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_cliente_email ON public."Cliente" USING btree (email);


--
-- TOC entry 3345 (class 1259 OID 16523)
-- Name: idx_pedido_cliente; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_pedido_cliente ON public."Pedido" USING btree (id_cliente);


--
-- TOC entry 3346 (class 1259 OID 16525)
-- Name: idx_pedido_data; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_pedido_data ON public."Pedido" USING btree (data_pedido);


--
-- TOC entry 3347 (class 1259 OID 16524)
-- Name: idx_pedido_status; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_pedido_status ON public."Pedido" USING btree (status);


--
-- TOC entry 3331 (class 1259 OID 16520)
-- Name: idx_produto_categoria; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_produto_categoria ON public."Produto" USING btree (id_categoria);


--
-- TOC entry 3332 (class 1259 OID 16519)
-- Name: idx_produto_nome; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_produto_nome ON public."Produto" USING btree (nome);


--
-- TOC entry 3360 (class 2606 OID 16509)
-- Name: Carrinho FK_Carrinho_Cliente; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Carrinho"
    ADD CONSTRAINT "FK_Carrinho_Cliente" FOREIGN KEY (id_cliente) REFERENCES public."Cliente"(id_cliente) ON DELETE CASCADE;


--
-- TOC entry 3361 (class 2606 OID 16514)
-- Name: Carrinho FK_Carrinho_Produto; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Carrinho"
    ADD CONSTRAINT "FK_Carrinho_Produto" FOREIGN KEY (id_produto) REFERENCES public."Produto"(id_produto) ON DELETE CASCADE;


--
-- TOC entry 3355 (class 2606 OID 16453)
-- Name: Endereco FK_Endereco_Cliente; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Endereco"
    ADD CONSTRAINT "FK_Endereco_Cliente" FOREIGN KEY (id_cliente) REFERENCES public."Cliente"(id_cliente) ON DELETE CASCADE;


--
-- TOC entry 3358 (class 2606 OID 16489)
-- Name: ItemPedido FK_ItemPedido_Pedido; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ItemPedido"
    ADD CONSTRAINT "FK_ItemPedido_Pedido" FOREIGN KEY (id_pedido) REFERENCES public."Pedido"(id_pedido) ON DELETE CASCADE;


--
-- TOC entry 3359 (class 2606 OID 16494)
-- Name: ItemPedido FK_ItemPedido_Produto; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."ItemPedido"
    ADD CONSTRAINT "FK_ItemPedido_Produto" FOREIGN KEY (id_produto) REFERENCES public."Produto"(id_produto);


--
-- TOC entry 3356 (class 2606 OID 16470)
-- Name: Pedido FK_Pedido_Cliente; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Pedido"
    ADD CONSTRAINT "FK_Pedido_Cliente" FOREIGN KEY (id_cliente) REFERENCES public."Cliente"(id_cliente);


--
-- TOC entry 3357 (class 2606 OID 16475)
-- Name: Pedido FK_Pedido_Vendedor; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Pedido"
    ADD CONSTRAINT "FK_Pedido_Vendedor" FOREIGN KEY (id_vendedor) REFERENCES public."Usuario"(id_usuario);


--
-- TOC entry 3354 (class 2606 OID 16425)
-- Name: Produto FK_Produto_Categoria; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."Produto"
    ADD CONSTRAINT "FK_Produto_Categoria" FOREIGN KEY (id_categoria) REFERENCES public."Categoria"(id_categoria);


-- Completed on 2025-06-12 19:33:55 UTC

--
-- PostgreSQL database dump complete
--

