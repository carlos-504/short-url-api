# Short URL API

API REST em Node.js (NestJS) para encurtamento de URLs, cadastro e autenticação de usuários. Projeto preparado para infraestrutura que escala verticalmente e organizado em camadas no padrão DDD.

## Requisitos

- **Node.js** (versão LTS estável, ex.: 18.x ou 20.x)
- **PostgreSQL**
- **npm** (ou yarn/pnpm)

## Como rodar o projeto

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

- **POST /auth/register** – Cadastro de usuário (e-mail, senha). Retorna `accessToken` (usar como `Authorization: Bearer <accessToken>`).
- **POST /auth/login** – Login com e-mail e senha. Retorna `accessToken` (Bearer Token).

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

## Scripts úteis

```bash
npm run build        # build de produção
npm run start:dev    # desenvolvimento com watch
npm run start:prod   # rodar build de produção
npm run lint         # ESLint
npm run test         # testes unitários
npm run test:e2e     # testes e2e
```

## Licença

UNLICENSED (projeto privado).
