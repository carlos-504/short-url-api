# Short URL API

API REST em Node.js (NestJS) para encurtamento de URLs, cadastro e autenticação de usuários. Projeto preparado para infraestrutura que escala verticalmente e organizado em camadas no padrão DDD.

## Requisitos

- **Node.js** (versão LTS estável, ex.: 18.x ou 20.x)
- **PostgreSQL**
- **npm** (ou yarn/pnpm)

## Como rodar o projeto

### Opção A: Docker Compose (ambiente completo local)

Sobe o banco PostgreSQL e a aplicação em containers. Usa **`Dockerfile.dev`** (desenvolvimento com hot-reload):

```bash
docker compose up -d
```

- **Banco:** PostgreSQL 16 na porta `5432` (usuário/senha/DB: `shorturl`/`shorturl`/`short_url_db`).
- **API:** `http://localhost:3000` (Swagger em `http://localhost:3000/api/docs`).
- **Volumes:** `./src` e `./prisma` montados no container (mudanças refletem automaticamente).

As migrações rodam automaticamente na subida do container da aplicação. Para ver os logs: `docker compose logs -f app`.

Para parar: `docker compose down`. Para remover também o volume do banco: `docker compose down -v`.

**Para produção:** use `Dockerfile.prod` (build otimizado, sem volumes, sem dev dependencies).

### Opção B: Local (Node + PostgreSQL no host)

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd short-url-api
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores:

```bash
cp .env.example .env
```

Edite o `.env` e defina pelo menos:

- `DATABASE_URL` – conexão com o PostgreSQL (ex.: `postgresql://user:password@localhost:5432/short_url_db`)
- `JWT_SECRET` – chave secreta para os tokens JWT (em produção use um valor forte e único)

Opcionais (com padrões):

- `PORT` – porta do servidor (padrão: 3000)
- `APP_URL` – URL base da API para montar a URL encurtada retornada (padrão: http://localhost:3000)
- `BCRYPT_SALT_ROUNDS` – rodadas do bcrypt para hash de senha (padrão: 10)

### 3. Banco de dados

Aplicar migrações e gerar o cliente Prisma:

```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Subir a aplicação

```bash
# desenvolvimento (watch)
npm run start:dev

# produção (build + start)
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

### Documentação OpenAPI (Swagger)

Com a aplicação rodando, a documentação interativa da API está em:

- **Swagger UI:** `http://localhost:3000/api/docs`

Lá é possível visualizar todos os endpoints, schemas de request/response e testar as requisições (incluindo Bearer Token para rotas autenticadas).

## Variáveis de ambiente

| Variável            | Obrigatória | Descrição                                                                 | Padrão              |
|---------------------|-------------|---------------------------------------------------------------------------|---------------------|
| `DATABASE_URL`      | Sim         | URL de conexão PostgreSQL                                                 | -                   |
| `JWT_SECRET`        | Sim (prod)  | Segredo para assinatura dos tokens JWT                                    | -                   |
| `PORT`              | Não         | Porta do servidor HTTP                                                    | 3000                |
| `APP_URL`           | Não         | URL base da API (para montar a URL encurtada completa na resposta)       | http://localhost:3000 |
| `BCRYPT_SALT_ROUNDS`| Não         | Rodadas de salt do bcrypt para hash de senha                              | 10                  |

Valores que **não** são variáveis de ambiente (fixos no código): tamanho do código encurtado (6 caracteres), prefixo da rota de redirecionamento (`/r`), tempo de expiração do JWT (7 dias).

## Endpoints da API

### Autenticação (Bearer Token)

- **POST /auth/login** – Login com e-mail e senha. Retorna `accessToken` (Bearer Token).

### Cadastro de usuário

- **POST /user** – Cadastro de usuário (e-mail, senha).

### Encurtar URL (um único endpoint)

- **POST /short-url** – Aceita requisições **com ou sem** autenticação.
  - Body: `{ "originalUrl": "https://..." }`
  - Se autenticado: associa a URL encurtada ao usuário.
  - Resposta: URL encurtada **incluindo o domínio** (ex.: `http://localhost:3000/r/aZbKq7`).
  - Código encurtado: no máximo 6 caracteres.

### Redirecionamento e contagem de cliques

- **GET /r/:code** – Redireciona para a URL de origem e **contabiliza** o acesso (incrementa cliques). Qualquer um pode acessar.

### Endpoints que exigem autenticação

- **GET /short-url** – Lista URLs encurtadas do usuário, com **quantidade de cliques**.
- **PATCH /short-url/:id** – Atualiza a URL de destino (origem) de um URL encurtado do usuário.
- **DELETE /short-url/:id** – Exclui (soft delete) um URL encurtado do usuário.

Requisições autenticadas: header `Authorization: Bearer <accessToken>`.

## Regras de negócio

- URLs encurtadas têm código de **no máximo 6 caracteres**.
- Todo acesso a uma URL encurtada (GET /r/:code) é **contabilizado**.
- Listagem do usuário mostra a **quantidade de cliques**.
- Registros possuem **createdAt** e **updatedAt**.
- Exclusão é **lógica** (campo `deletedAt`); registros com `deletedAt` preenchido não são retornados nem alterados.

## Estrutura do projeto (DDD)

- `application/` – use cases, DTOs e orquestração.
- `domain/` – entidades e interfaces de repositório.
- `infrastructure/` – implementações (ex.: Prisma).
- `presentation/` – controllers, guards, estratégias JWT.
- Módulos Nest em `user/`, `auth/`, `short-url/` na raiz de `src/`.

## Docker

O projeto possui dois Dockerfiles:

- **`Dockerfile.dev`** – para desenvolvimento local com Docker Compose (hot-reload, volumes montados).
- **`Dockerfile.prod`** – para produção (multi-stage, build otimizado, sem dev dependencies).

O `docker-compose.yml` usa `Dockerfile.dev` por padrão. Para usar o de produção, altere o `dockerfile` no compose ou rode:

```bash
docker build -f Dockerfile.prod -t short-url-api:prod .
```

## Scripts úteis

```bash
npm run build        # build de produção
npm run start:dev    # desenvolvimento com watch
npm run start:prod   # rodar build de produção
npm run lint         # ESLint
npm run test         # testes unitários
npm run test:e2e     # testes e2e
npm run test:cov     # testes com cobertura
```

## Testes

O projeto possui uma estrutura organizada de testes em `test/`:

```
test/
├── unit/controllers/        # Testes unitários dos controllers
├── mocks/                   # Mocks reutilizáveis (User, ShortUrl, Express)
└── *.e2e-spec.ts           # Testes E2E
```

### Testes Unitários

- **UserController**: criação de usuários
- **AuthController**: login e geração de JWT
- **ShortUrlController**: CRUD de URLs encurtadas
- **RedirectController**: redirecionamento e contagem de cliques

Os testes usam **mocks centralizados** e **não acessam o banco de dados**.

```bash
# Rodar todos os testes unitários
npm test -- --testPathPatterns="test/unit"

# Rodar testes de um controller específico
npm test -- user.controller.spec.ts

# Rodar com cobertura
npm run test:cov
```

Veja `test/README.md` para mais detalhes sobre a estrutura de testes.

## Licença

UNLICENSED (projeto privado).
