--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13

-- Started on 2025-07-01 10:34:24 UTC

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
-- TOC entry 214 (class 1259 OID 16385)
-- Name: cliente; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.cliente (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(255) NOT NULL,
    email character varying(255),
    telefone character varying(255),
    cpf_cnpj character varying(255),
    senha character varying(255),
    ativo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.cliente OWNER TO admin;

--
-- TOC entry 215 (class 1259 OID 16392)
-- Name: produto; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.produto (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(255) NOT NULL,
    descricao character varying(255),
    preco numeric(38,2) NOT NULL,
    quantidade integer DEFAULT 0 NOT NULL,
    imagem_url character varying(100),
    ativo boolean DEFAULT true NOT NULL,
    imagem character varying(255)
);


ALTER TABLE public.produto OWNER TO admin;

--
-- TOC entry 216 (class 1259 OID 16400)
-- Name: usuario; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.usuario (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    cargo character varying(255) NOT NULL,
    senha character varying(255) NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    cpf_cnpj character varying(255)
);


ALTER TABLE public.usuario OWNER TO admin;

--
-- TOC entry 3367 (class 0 OID 16385)
-- Dependencies: 214
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.cliente (id, nome, email, telefone, cpf_cnpj, senha, ativo) FROM stdin;
7460e3a8-e2c8-4d1c-9f10-93d36f093f0e	Beatriz Martins	beatriz.martins@email.com	(11) 91234-5678	111.222.333-44	cliente1	t
0bf0a261-77b3-4838-852e-83a7608b75f4	Leandro Gomes	leandro.gomes@email.com	(11) 92345-6789	222.333.444-55	cliente2	t
ec73524b-d564-409e-89ea-f040d85c55d8	Manuela Barbosa	manuela.barbosa@email.com	(11) 93456-7890	333.444.555-66	cliente3	t
f4043650-a2d6-47d5-8ecf-eec8d2a2f17a	Thiago Rocha	thiago.rocha@email.com	(11) 94567-8901	444.555.666-77	cliente4	t
6c0afa62-2bfd-4d79-81ac-9fdfd5aed402	Yasmin Azevedo	yasmin.azevedo@email.com	(11) 95678-9012	555.666.777-88	cliente5	t
79a896da-3f47-4e81-93d7-e9d8d60a6dfd	Enzo Ribeiro	enzo.ribeiro@email.com	(11) 96789-0123	666.777.888-99	cliente6	t
bd8e32f8-5a1c-4147-bfe0-c9c0500b5250	Laura Castro	laura.castro@email.com	(11) 97890-1234	777.888.999-00	cliente7	t
55e7547c-8770-40fc-80a7-3b9ea425ff61	Arthur Cunha	arthur.cunha@email.com	(11) 98901-2345	888.999.000-11	cliente8	t
fab4a480-edd2-49ca-9710-806304ac86b8	Valentina Dias	valentina.dias@email.com	(11) 99012-3456	999.000.111-22	cliente9	t
b357ee10-6d81-4a52-a127-1ab0b04e904c	Lucas Cardoso	lucas.cardoso@email.com	(11) 90123-4567	000.111.222-33	cliente10	t
ef4b12e9-a352-40ed-aff5-9bb0155bcf09	Isabella Correia	isabella.correia@email.com	(11) 91234-5679	111.222.333-45	cliente11	t
f442e87e-32db-4dab-9c8d-1a488626ef1b	Miguel Ferreira	miguel.ferreira@email.com	(11) 92345-6780	222.333.444-56	cliente12	t
96b7a8d1-22d2-4055-bd58-7453a9aecabc	Alice Mendes	alice.mendes@email.com	(11) 93456-7891	333.444.555-67	cliente13	t
fcdf1970-10ee-466a-87ec-645f46112a37	Davi Barros	davi.barros@email.com	(11) 94567-8902	444.555.666-78	cliente14	t
dbdd597b-7161-4e8e-9bfd-e59cd031796e	Sophia Pinto	sophia.pinto@email.com	(11) 95678-9013	555.666.777-89	cliente15	t
661f9c80-3f72-409c-a5b1-edf7428f9aca	Bernardo Campos	bernardo.campos@email.com	(11) 96789-0124	666.777.888-90	cliente16	t
6fe9b93d-d944-4883-ba64-945b02a1e540	Helena Duarte	helena.duarte@email.com	(11) 97890-1235	777.888.999-01	cliente17	t
d22fc5c0-af69-4423-8588-81f5c4de58b4	Heitor Moreira	heitor.moreira@email.com	(11) 98901-2346	888.999.000-12	cliente18	t
458bc8d1-5622-425c-b3ae-a66492a57461	Lívia Cavalcanti	livia.cavalcanti@email.com	(11) 99012-3457	999.000.111-23	cliente19	t
8269c225-5bd1-46c1-b4af-9cc912c6c39a	Theo Teixeira	theo.teixeira@email.com	(11) 90123-4568	000.111.222-34	cliente20	t
\.


--
-- TOC entry 3368 (class 0 OID 16392)
-- Dependencies: 215
-- Data for Name: produto; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.produto (id, nome, descricao, preco, quantidade, imagem_url, ativo, imagem) FROM stdin;
ed7de540-9f23-4807-8d4a-3c47ee85c827	Orquídea Phalaenopsis	Orquídea branca de haste dupla.	89.90	15	\N	t	\N
b929a6a0-a0f0-4871-ba30-9e38f7cab06e	Lírio Amarelo	Lírios amarelos vibrantes em vaso.	45.50	25	\N	t	\N
85eb2f94-cd84-4633-8972-4acfce8d34b5	Begônia	Begônia de flores rosas e folhagem ornamental.	35.00	30	\N	t	\N
e5c46804-f8ba-4d33-a5ec-8e8b24bebac0	Cacto Mandacaru	Cacto de porte médio, resistente e de fácil cuidado.	55.00	20	\N	t	\N
775350fa-e135-4706-b5cc-68778680367c	Samambaia	Planta pendente com folhas verdes e longas.	42.00	18	\N	t	\N
e63d3dc0-971d-4a7f-bc21-713c55e3fc9f	Girassol em Vaso	Girassol plantado, ideal para presentear.	29.90	40	\N	t	\N
c72b2701-2efd-4c33-a966-919e4f95467d	Violeta	Violeta com flores roxas e aveludadas.	15.00	50	\N	t	\N
d5d96c96-92b8-4224-8bfb-6e7dab583a22	Suculenta Echeveria	Suculenta em formato de roseta.	12.50	60	\N	t	\N
9d1f5e15-380c-4f09-8617-3894963db0ba	Antúrio	Antúrio com flores vermelhas brilhantes.	65.00	12	\N	t	\N
cbc842c1-1d4b-4dfd-a723-500047aa5472	Kalanchoe	Kalanchoe com flores laranjas dobradas.	22.00	35	\N	t	\N
\.


--
-- TOC entry 3369 (class 0 OID 16400)
-- Dependencies: 216
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.usuario (id, nome, email, cargo, senha, ativo, cpf_cnpj) FROM stdin;
69a39a8a-ddb0-4010-9ad7-58e93ebd8eed	Ana Lima	ana.lima@email.com	VENDEDOR	senha456	t	550.724.100-72
899702a8-6f45-4cdc-b78e-3958a5a0a577	Carlos Pereira	carlos.pereira@email.com	VENDEDOR	senha123	t	210.232.350-13
8f08805a-3e91-4519-b48e-aa49ca06f9cd	Administrador	gerente@gerente.com	GERENTE	asd	t	88.693.399/0001-84
9f3b50f4-4e26-4b52-b352-191aae066421	Rafael Souza	rafael.souza@email.com	VENDEDOR	senha789	t	494.207.820-26
e9db574c-11ce-45e6-8cb1-344591cc294e	Juliana Costa	juliana.costa@email.com	VENDEDOR	senha101	t	178.554.820-40
\.


--
-- TOC entry 3214 (class 2606 OID 16408)
-- Name: cliente cliente_cpf_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_cpf_cnpj_key UNIQUE (cpf_cnpj);


--
-- TOC entry 3216 (class 2606 OID 16410)
-- Name: cliente cliente_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_email_key UNIQUE (email);


--
-- TOC entry 3218 (class 2606 OID 16412)
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id);


--
-- TOC entry 3220 (class 2606 OID 16414)
-- Name: produto produto_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.produto
    ADD CONSTRAINT produto_pkey PRIMARY KEY (id);


--
-- TOC entry 3222 (class 2606 OID 16416)
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- TOC entry 3224 (class 2606 OID 16418)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


-- Completed on 2025-07-01 10:34:24 UTC

--
-- PostgreSQL database dump complete
--
