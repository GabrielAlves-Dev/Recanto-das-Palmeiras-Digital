# Recanto das Palmeiras Digital

## 📖 Sobre o Projeto

**Recanto das Palmeiras Digital** é uma solução de software completa e moderna para a gestão de floriculturas, unindo a eficiência de um sistema de ponto de venda (PDV) com a conveniência de uma plataforma de e-commerce.

Este projeto nasceu na academia, desenvolvido para a disciplina de **Projeto Integrado em Engenharia de Software** da **Universidade Federal do Ceará (UFC) - Campus Quixadá**, no período de **2025.1**, sob a orientação da **Professora Leonara**.

O principal stakeholder e inspiração para o projeto foi a floricultura **Recanto das Palmeiras**, localizada na cidade de Paraipaba, Ceará, cujas necessidades operacionais guiaram o desenvolvimento das funcionalidades.

**Integrantes:**
* Gabriel Alves
* Tiago Tito
* Robson José

*Com agradecimentos especiais a Gustavo Fernandes pela colaboração.*

---

## ✨ Destaques e Funcionalidades

O sistema foi projetado em torno de três experiências de usuário distintas e complementares:

### 🤵 Para Clientes: Uma Experiência de Compra Única
O portal do cliente foi desenhado para ser intuitivo e agradável, permitindo uma jornada de compra fluida e completa.
* **Navegação e Descoberta**: Explore um catálogo de produtos visualmente rico, com filtros inteligentes para encontrar facilmente o arranjo ou planta ideal.
* **Gestão da Conta**: Realize o autocadastro, faça login e gerencie seus dados pessoais com total autonomia e segurança.
* **Carrinho e Checkout**: Adicione produtos ao carrinho, ajuste quantidades e finalize o pedido através de um processo de checkout simples e direto.
* **Acompanhamento de Pedidos**: Consulte o histórico de compras e acompanhe o status de cada pedido em tempo real.

### 👨‍💼 Para Vendedores: Ferramentas que Impulsionam as Vendas
O portal do vendedor é uma central de comando projetada para agilizar o atendimento e maximizar a eficiência da equipe de vendas.
* **Visão 360° dos Pedidos**: Gerencie todos os pedidos recebidos, sejam eles online ou de balcão, atualizando seus status com poucos cliques.
* **Venda Assistida**: Crie pedidos diretamente para os clientes, consultando o catálogo e o histórico de compras para oferecer um atendimento personalizado.
* **Gerenciamento de Clientes**: Acesse e consulte a base de clientes para um relacionamento mais próximo e eficaz.

### 👑 Para Gerentes: Controle Estratégico e Total da Operação
O portal do gerente oferece uma visão macro do negócio, com ferramentas poderosas para a tomada de decisões estratégicas.
* **Gestão Total de Produtos**: Tenha controle absoluto sobre o inventário, com funcionalidades para criar, editar, precificar e gerenciar a visibilidade (ativo/inativo) de cada item do catálogo.
* **Administração de Equipe**: Gerencie os usuários internos do sistema, definindo cargos e controlando o acesso às funcionalidades.
* **Supervisão Completa**: Acesso a todas as funcionalidades dos vendedores, garantindo uma visão completa das operações diárias.

---

## 🛠️ Arquitetura e Tecnologias

O projeto adota uma arquitetura de microsserviços desacoplada, com uma API robusta no backend e uma interface moderna e reativa no frontend. Essa separação garante escalabilidade, manutenibilidade e uma melhor experiência de desenvolvimento.

### Backend
* **Linguagem**: Java 21
* **Framework**: Spring Boot 3
* **Persistência**: Spring Data JPA
* **Segurança**: Spring Security

### Frontend
* **Framework**: React 19
* **Linguagem**: TypeScript
* **Build Tool**: Vite
* **Estilização**: Tailwind CSS

### Banco de Dados e Infraestrutura
* **Banco de Dados**: PostgreSQL
* **Containerização**: Docker e Docker Compose