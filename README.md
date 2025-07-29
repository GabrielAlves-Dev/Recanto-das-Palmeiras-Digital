# Recanto das Palmeiras Digital

---

## 🇧🇷 Versão em Português (pt-BR)

### 📖 Sobre o Projeto

**Recanto das Palmeiras Digital** é uma solução de software completa e moderna para a gestão de floriculturas, unindo a eficiência de um sistema de ponto de venda (PDV) com a conveniência de uma plataforma de e-commerce.

Este projeto nasceu no ambiente acadêmico, desenvolvido para a disciplina de **Projeto Integrado em Engenharia de Software** da **Universidade Federal do Ceará (UFC) - Campus Quixadá**, no período de **2025.1**, sob a orientação da **Professora Leonara**.

O principal stakeholder e inspiração para o projeto foi a floricultura **Recanto das Palmeiras**, localizada na cidade de Paraipaba, Ceará, cujas necessidades operacionais guiaram o desenvolvimento das funcionalidades.

**Integrantes:**
* Gabriel Alves
* Tiago Tito
* Robson José

*Com agradecimentos especiais a Gustavo Fernandes pela colaboração.*

### ✨ Destaques e Funcionalidades

O sistema foi projetado em torno de três experiências de usuário distintas e complementares:

#### 🤵 Para Clientes: Uma Experiência de Compra Única
* **Navegação e Descoberta**: Explore um catálogo de produtos visualmente rico, com filtros inteligentes para encontrar facilmente o arranjo ou planta ideal.
* **Gestão da Conta**: Realize o autocadastro, faça login e gerencie seus dados pessoais com total autonomia e segurança.
* **Carrinho e Checkout**: Adicione produtos ao carrinho, ajuste quantidades e finalize o pedido através de um processo de checkout simples e direto.
* **Acompanhamento de Pedidos**: Consulte o histórico de compras e acompanhe o status de cada pedido em tempo real.

#### 👨‍💼 Para Vendedores: Ferramentas que Impulsionam as Vendas
* **Visão 360° dos Pedidos**: Gerencie todos os pedidos recebidos, sejam eles online ou de balcão, atualizando seus status com poucos cliques.
* **Venda Assistida**: Crie pedidos diretamente para os clientes, consultando o catálogo e o histórico de compras para oferecer um atendimento personalizado.
* **Gerenciamento de Clientes**: Acesse e consulte a base de clientes para um relacionamento mais próximo e eficaz.

#### 👑 Para Gerentes: Controle Estratégico e Total da Operação
* **Gestão Total de Produtos**: Tenha controle absoluto sobre o inventário, com funcionalidades para criar, editar, precificar e gerenciar a visibilidade (ativo/inativo) de cada item do catálogo.
* **Administração de Equipe**: Gerencie os usuários internos do sistema, definindo cargos e controlando o acesso às funcionalidades.
* **Supervisão Completa**: Acesso a todas as funcionalidades dos vendedores, garantindo uma visão completa das operações diárias.

### 🛠️ Arquitetura e Tecnologias

O projeto adota uma arquitetura desacoplada, com uma API robusta no backend e uma interface moderna e reativa no frontend, garantindo escalabilidade e manutenibilidade.

* **Backend**: Java 21, Spring Boot 3, Spring Security e JPA.
* **Frontend**: React 19 e TypeScript.
* **Banco de Dados e Infra**: PostgreSQL e Docker.

### ⚙️ Configuração e Execução Local

Para configurar e rodar a aplicação em seu ambiente local para desenvolvimento e testes:

**Pré-requisitos:**
* Java Development Kit (JDK) 21 ou superior.
* Node.js (versão 20 ou superior) e npm.
* Docker e Docker Compose.

**Passos para execução:**

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/GabrielAlves-dev/recanto-das-palmeiras-digital.git](https://github.com/GabrielAlves-dev/recanto-das-palmeiras-digital.git)
    cd recanto-das-palmeiras-digital
    ```

2.  **Configurar Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto (no mesmo nível de `docker-compose.yaml`) com as seguintes variáveis:
    ```
    # Variáveis para o Banco de Dados (PostgreSQL)
    DB_NAME=recanto_das_palmeiras
    DB_USER=postgres
    DB_PASSWORD=your_db_password # Escolha uma senha forte
    DB_PORT=5432 # Porta para acessar o banco de dados localmente

    # Variáveis para o PgAdmin
    PGADMIN_EMAIL=admin@admin.com
    PGADMIN_PASSWORD=admin
    PGADMIN_PORT=8081
    PGADMIN_LISTEN_PORT=80

    # Variáveis para o Backend
    SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/${DB_NAME}
    JWT_SECRET=vary-secret-key # Mantenha esta chave secreta em produção!
    ```
    *Altere `your_db_password` para uma senha de sua escolha.*

3.  **Iniciar Banco de Dados e Backend com Docker Compose:**
    Navegue até a raiz do projeto no terminal e execute:
    ```bash
    docker-compose up --build -d
    ```
    Isso irá:
    * Construir a imagem Docker do backend.
    * Iniciar um container PostgreSQL com os dados iniciais.
    * Iniciar o backend Spring Boot.
    * Iniciar o PgAdmin para gerenciar o banco de dados (acessível em `http://localhost:8081`).

4.  **Configurar e Rodar o Frontend:**
    Navegue até o diretório `frontend`:
    ```bash
    cd frontend
    ```
    Instale as dependências:
    ```bash
    npm install
    ```
    Inicie o servidor de desenvolvimento do frontend:
    ```bash
    npm run dev
    ```
    O frontend estará acessível em `http://localhost:5173` (ou outra porta disponível indicada pelo Vite).

### 🚀 Pipeline de CI/CD (GitHub Actions)

Este projeto utiliza GitHub Actions para automação de Integração Contínua (CI) e Entrega Contínua (CD).

Existem dois pipelines configurados: um para o backend e outro para o frontend. Ambos são acionados automaticamente a cada `push` na branch `main`.

#### **1. Backend CI/CD (`.github/workflows/backend-ci-cd.yml`)**

Este pipeline é responsável por construir, empacotar e implantar o backend no AWS Elastic Beanstalk.

* **Acionamento**: `push` na branch `main` para mudanças dentro da pasta `backend/`.
* **Etapas**:
    * **`Checkout Code`**: Clona o código do repositório.
    * **`Set up Java JDK 21`**: Configura o ambiente Java 21 necessário para o build do Spring Boot.
    * **`Grant execute permission for mvnw`**: Garante que o script `mvnw` (Maven Wrapper) tenha permissão de execução.
    * **`Build and Package Backend`**: Navega até o diretório `backend`, executa `mvn clean install -DskipTests` para compilar e empacotar a aplicação em um JAR, e renomeia o JAR para `app.jar` dentro de `target/`.
    * **`Configure AWS Credentials`**: Configura as credenciais da AWS utilizando os segredos do GitHub para autenticação.
    * **`Create deployment package (ZIP)`**: Cria um arquivo ZIP (`backend-deploy.zip`) contendo apenas o `app.jar` na sua raiz. Este ZIP é o pacote de deploy que será enviado para o Elastic Beanstalk.
    * **`Deploy to Elastic Beanstalk`**: Utiliza a ação `einaregilsson/beanstalk-deploy@v21` para enviar o `backend-deploy.zip` para o ambiente do Elastic Beanstalk (`Recanto-das-palmeiras-app-env-2`) na região `us-east-1`.

#### **2. Frontend CI/CD (`.github/workflows/frontend-ci-cd.yml`)**

Este pipeline é responsável por instalar dependências, construir e implantar o frontend no AWS S3.

* **Acionamento**: `push` na branch `main` para mudanças dentro da pasta `frontend/`.
* **Etapas**:
    * **`Checkout Code`**: Clona o código do repositório.
    * **`Set up Node.js`**: Configura o ambiente Node.js (v22.7.0) necessário para o build do React.
    * **`Clean npm cache and Install Frontend Dependencies`**: Navega até o diretório `frontend`, limpa o cache do npm (`npm cache clean --force`) e instala todas as dependências (`npm install`).
    * **`Build Frontend`**: Executa o comando `npm run build` para compilar o projeto React para produção. Os arquivos estáticos são gerados na pasta `dist/`.
    * **`Configure AWS Credentials`**: Configura as credenciais da AWS utilizando os segredos do GitHub para autenticação.
    * **`Deploy S3 website`**: Navega até o diretório `frontend`.
        * `aws s3 sync`: Sincroniza o conteúdo da pasta `dist/` com o bucket S3 (`recanto-das-palmeiras-frontend`), removendo arquivos antigos do bucket que não estão mais na `dist/`.
        * `aws s3 cp index.html`: Copia o `index.html` e `404.html` de volta para si mesmos no S3 para atualizar metadados como `Content-Type` e `Cache-Control`, sem usar ACLs, já que o bucket está configurado para políticas de bucket.

### 🌐 Acesso à Aplicação Implantada na AWS

Para acessar a aplicação após a implantação bem-sucedida:

1.  **Frontend (Site Estático no S3):**
    O frontend é hospedado como um site estático no AWS S3. Você pode acessá-lo através do **Endpoint do Website S3**.
    * Vá para o console do AWS S3.
    * Localize o bucket de nome `recanto-das-palmeiras-frontend`.
    * Vá para a aba `Properties` (Propriedades).
    * Role para baixo até a seção `Static website hosting` (Hospedagem de site estático). O URL do seu site estará listado lá.

2.  **Backend (API no Elastic Beanstalk):**
    O backend é implantado no AWS Elastic Beanstalk. Você pode acessá-lo através da URL do ambiente do Elastic Beanstalk.
    * Vá para o console do AWS Elastic Beanstalk.
    * Selecione seu aplicativo (`recanto-das-palmeiras-app`).
    * Clique no ambiente (`Recanto-das-palmeiras-app-env-2`).
    * A URL do seu ambiente estará visível na página de visão geral do ambiente.

Lembre-se que para o frontend ser acessível, é necessário que o bucket S3 tenha a política de bucket configurada para acesso público de leitura, conforme instruído anteriormente.

---

<br>

## 🇺🇸 English Version (en-US)

### 📖 About the Project

**Recanto das Palmeiras Digital** is a complete and modern software solution for flower shop management, combining the efficiency of a Point of Sale (POS) system with the convenience of an e-commerce platform.

This project originated in an academic setting, developed for the **Integrated Project in Software Engineering** course at the **Federal University of Ceará (UFC) - Quixadá Campus**, during the **2025.1** semester, under the guidance of **Professor Leonara**.

The main stakeholder and inspiration for the project was the **Recanto das Palmeiras** flower shop, located in Paraipaba, Ceará, Brazil, whose operational needs guided the development of the features.

**Team Members:**
* Gabriel Alves
* Tiago Tito
* Robson José

*With special thanks to Gustavo Fernandes for his collaboration.*

### ✨ Highlights & Features

The system is designed around three distinct and complementary user experiences:

#### 🤵 For Customers: A Unique Shopping Experience
* **Discovery and Navigation**: Browse a visually rich product catalog with smart filters to easily find the perfect arrangement or plant.
* **Account Management**: Self-register, log in, and manage personal data with full autonomy and security.
* **Shopping Cart & Checkout**: Add products to the cart, adjust quantities, and complete orders through a simple and direct checkout process.
* **Order Tracking**: View purchase history and track the status of each order in real-time.

#### 👨‍💼 For Sellers: Tools to Boost Sales
* **360° Order View**: Manage all incoming orders, whether placed online or in-store, and update their statuses with just a few clicks.
* **Assisted Sales**: Create orders directly for customers, consulting the catalog and their purchase history to offer personalized service.
* **Customer Management**: Access and consult the customer base for a closer and more effective relationship.

#### 👑 For Managers: Strategic and Total Operational Control
* **Full Product Management**: Have absolute control over the inventory, with features to create, edit, price, and manage the visibility (active/inactive) of every item in the catalog.
* **Team Administration**: Manage internal system users, defining roles and controlling access to features.
* **Complete Oversight**: Access all seller functionalities, ensuring a comprehensive view of daily operations.

### 🛠️ Architecture and Technologies

The project adopts a decoupled architecture with a robust API backend and a modern, reactive frontend, ensuring scalability and maintainability.

* **Backend**: Java 21, Spring Boot 3, Spring Security, and JPA.
* **Frontend**: React 19 and TypeScript.
* **Database & Infra**: PostgreSQL and Docker.

### ⚙️ Local Setup and Running

To set up and run the application in your local environment for development and testing:

**Prerequisites:**
* Java Development Kit (JDK) 21 or higher.
* Node.js (version 20 or higher) and npm.
* Docker and Docker Compose.

**Steps to run:**

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/GabrielAlves-dev/recanto-das-palmeiras-digital.git](https://github.com/GabrielAlves-dev/recanto-das-palmeiras-digital.git)
    cd recanto-das-palmeiras-digital
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file in the project root (at the same level as `docker-compose.yaml`) with the following variables:
    ```
    # Variables for the Database (PostgreSQL)
    DB_NAME=recanto_das_palmeiras
    DB_USER=postgres
    DB_PASSWORD=your_db_password # Choose a strong password
    DB_PORT=5432 # Port to access the database locally

    # Variables for PgAdmin
    PGADMIN_EMAIL=admin@admin.com
    PGADMIN_PASSWORD=admin
    PGADMIN_PORT=8081
    PGADMIN_LISTEN_PORT=80

    # Variables for the Backend
    SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/${DB_NAME}
    JWT_SECRET=vary-secret-key # Keep this key secret in production!
    ```
    *Change `your_db_password` to a password of your choice.*

3.  **Start Database and Backend with Docker Compose:**
    Navigate to the project root in your terminal and execute:
    ```bash
    docker-compose up --build -d
    ```
    This will:
    * Build the backend Docker image.
    * Start a PostgreSQL container with initial data.
    * Start the Spring Boot backend.
    * Start PgAdmin for database management (accessible at `http://localhost:8081`).

4.  **Configure and Run the Frontend:**
    Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
    Install dependencies:
    ```bash
    npm install
    ```
    Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend will be accessible at `http://localhost:5173` (or another available port indicated by Vite).

### 🚀 CI/CD Pipeline (GitHub Actions)

This project uses GitHub Actions for Continuous Integration (CI) and Continuous Delivery (CD) automation.

There are two pipelines configured: one for the backend and one for the frontend. Both are automatically triggered on each `push` to the `main` branch.

#### **1. Backend CI/CD (`.github/workflows/backend-ci-cd.yml`)**

This pipeline is responsible for building, packaging, and deploying the backend to AWS Elastic Beanstalk.

* **Trigger**: `push` to the `main` branch for changes within the `backend/` folder.
* **Steps**:
    * **`Checkout Code`**: Clones the repository code.
    * **`Set up Java JDK 21`**: Sets up the Java 21 environment required for the Spring Boot build.
    * **`Grant execute permission for mvnw`**: Ensures that the `mvnw` (Maven Wrapper) script has execute permissions.
    * **`Build and Package Backend`**: Navigates to the `backend` directory, runs `mvn clean install -DskipTests` to compile and package the application into a JAR, and renames the JAR to `app.jar` inside `target/`.
    * **`Configure AWS Credentials`**: Configures AWS credentials using GitHub secrets for authentication.
    * **`Create deployment package (ZIP)`**: Creates a ZIP file (`backend-deploy.zip`) containing only the `app.jar` at its root. This ZIP is the deployment package that will be sent to Elastic Beanstalk.
    * **`Deploy to Elastic Beanstalk`**: Uses the `einaregilsson/beanstalk-deploy@v21` action to upload `backend-deploy.zip` to the Elastic Beanstalk environment (`Recanto-das-palmeiras-app-env-2`) in the `us-east-1` region.

#### **2. Frontend CI/CD (`.github/workflows/frontend-ci-cd.yml`)**

This pipeline is responsible for installing dependencies, building, and deploying the frontend to AWS S3.

* **Trigger**: `push` to the `main` branch for changes within the `frontend/` folder.
* **Steps**:
    * **`Checkout Code`**: Clones the repository code.
    * **`Set up Node.js`**: Sets up the Node.js environment (v22.7.0) required for the React build.
    * **`Clean npm cache and Install Frontend Dependencies`**: Navigates to the `frontend` directory, cleans the npm cache (`npm cache clean --force`), and installs all dependencies (`npm install`).
    * **`Build Frontend`**: Executes the `npm run build` command to compile the React project for production. Static files are generated in the `dist/` folder.
    * **`Configure AWS Credentials`**: Configures AWS credentials using GitHub secrets for authentication.
    * **`Deploy S3 website`**: Navigates to the `frontend` directory.
        * `aws s3 sync`: Synchronizes the content of the `dist/` folder with the S3 bucket (`recanto-das-palmeiras-frontend`), removing old files from the bucket that are no longer in `dist/`.
        * `aws s3 cp index.html`: Copies `index.html` and `404.html` back to themselves in S3 to update metadata like `Content-Type` and `Cache-Control`, without using ACLs, as the bucket is configured for bucket policies.

### 🌐 Accessing the Deployed Application on AWS

To access the application after successful deployment:

1.  **Frontend (Static Website on S3):**
    The frontend is hosted as a static website on AWS S3. You can access it via the **S3 Website Endpoint**.
    * Go to the AWS S3 console.
    * Locate your bucket named `recanto-das-palmeiras-frontend`.
    * Go to the `Properties` tab.
    * Scroll down to the `Static website hosting` section. Your website URL will be listed there.

2.  **Backend (API on Elastic Beanstalk):**
    The backend is deployed on AWS Elastic Beanstalk. You can access it via the Elastic Beanstalk environment URL.
    * Go to the AWS Elastic Beanstalk console.
    * Select your application (`recanto-das-palmeiras-app`).
    * Click on the environment (`Recanto-das-palmeiras-app-env-2`).
    * The URL for your environment will be visible on the environment overview page.

Remember that for the frontend to be accessible, the S3 bucket must have a bucket policy configured for public read access, as previously instructed.