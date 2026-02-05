# Short URL API

API REST em Node.js (NestJS) para encurtamento de URLs, cadastro e autenticação de usuários. Projeto organizado em camadas no padrão DDD.

**Ambiente em produção:** deploy em **instância EC2 da AWS**.

- **API:** http://100.52.215.33:3000
- **Swagger:** http://100.52.215.33:3000/api/docs

## Requisitos

- **Node.js** (LTS 18.x ou 20.x)
- **PostgreSQL**
- **npm**

## Como rodar o projeto

### Opção A: Docker Compose

Sobe PostgreSQL e a aplicação em containers. Usa **`Dockerfile.dev`** (desenvolvimento com hot-reload):

```bash
cp .env.example .env
# Edite .env e defina DATABASE_URL, JWT_SECRET e HASHIDS_SALT

docker compose up -d
```

- **Banco:** PostgreSQL 16 na porta `5432` (usuário/senha/DB: `shorturl`/`shorturl`/`short_url_db`), ou use um banco externo via `DATABASE_URL`.
- **API:** `http://localhost:3000` (Swagger em `http://localhost:3000/api/docs`).
- **Volumes:** `./src` e `./prisma` montados (hot-reload).

O Docker Compose usa as variáveis do seu `.env`. Defina no mínimo:

- `DATABASE_URL` – para banco externo; se omitido, usa o PostgreSQL local do compose.
- `JWT_SECRET` – obrigatório.
- `HASHIDS_SALT` – obrigatório (salt para geração dos códigos encurtados).

Para ver os logs: `docker compose logs -f app`. Para parar: `docker compose down`.

**Se aparecer erro "Cannot find module":** reconstrua a imagem:

```bash
docker compose build --no-cache app
docker compose up -d
```

**Produção:** use `Dockerfile.prod` e configure as variáveis no ambiente de deploy.

### Opção B: Local (Node + PostgreSQL)

```bash
git clone <url-do-repositorio>
cd short-url-api
npm install

cp .env.example .env
# Edite .env com DATABASE_URL, JWT_SECRET e HASHIDS_SALT

npx prisma generate
npx prisma migrate deploy

npm run start:dev
```

A API estará em `http://localhost:3000` (ou na porta definida em `PORT`).

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | URL de conexão PostgreSQL |
| `JWT_SECRET` | Sim | Segredo para assinatura dos tokens JWT |
| `HASHIDS_SALT` | Sim | Salt para geração dos códigos encurtados (Hashids) |
| `PORT` | Não | Porta do servidor (padrão: 3000) |
| `BCRYPT_SALT_ROUNDS` | Não | Rodadas do bcrypt (padrão: 10) |
| `OBSERVABILITY_ENABLED` | Não | Ativa observabilidade (`true`/`false`) |
| `OBSERVABILITY_PROVIDER` | Não | `sentry` \| `console` \| `noop` |
| `SENTRY_DSN` | Não | DSN do Sentry (quando provider=sentry) |
| `NODE_ENV` | Não | `development` \| `production` |
| `LOG_LEVEL` | Não | Nível de log (padrão: `info`) |
| `LOG_PRETTY` | Não | Saída legível dos logs (`true`/`false`) |

A URL base das URLs encurtadas é obtida da requisição HTTP (Host + protocolo).

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/login | Login (e-mail e senha). Retorna `accessToken`. |
| POST | /user | Cadastro de usuário |
| POST | /short-url | Encurtar URL (com ou sem autenticação) |
| GET | /r/:code | Redireciona e contabiliza cliques |
| GET | /short-url | Lista URLs do usuário (autenticado) |
| PATCH | /short-url/:id | Atualiza URL de destino (autenticado) |
| DELETE | /short-url/:id | Exclusão lógica (autenticado) |
| GET | /metrics | Métricas Prometheus (quando observabilidade ativa) |

**Swagger:** `http://localhost:3000/api/docs`

## Regras de negócio

- Código encurtado: no máximo 6 caracteres.
- Todo acesso (GET /r/:code) é contabilizado.
- Exclusão lógica (`deletedAt`).
- URLs base obtidas dinamicamente da requisição.

## Estrutura do projeto (DDD)

Detalhes em **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

- **domain/** – entidades, interfaces de repositório e tokens DI
- **application/** – use cases, DTOs e mappers
- **infrastructure/** – implementações Prisma
- **presentation/** – controllers, guards e JWT
- **modules/** – módulos NestJS
- **shared/observability/** – logs, métricas e Sentry

## Observabilidade

Configuração em **[docs/OBSERVABILITY.md](docs/OBSERVABILITY.md)**.

- **Providers:** noop, console, sentry
- **Ativar Sentry:** `OBSERVABILITY_ENABLED=true`, `OBSERVABILITY_PROVIDER=sentry` e `SENTRY_DSN`
- **Endpoint:** `/metrics` (Prometheus)

## CI/CD

O projeto usa **GitHub Actions** para lint e testes automatizados (`.github/workflows/lint-and-test.yml`). Executa em push e pull request na branch `main`.

## Scripts

```bash
npm run build        # build de produção
npm run start:dev    # desenvolvimento com watch
npm run start:prod   # rodar build de produção
npm run lint         # ESLint
npm run test         # testes unitários
npm run test:e2e     # testes E2E
npm run test:cov     # cobertura
```

## Testes

- **Unitários:** `test/unit/controllers/` – mocks, sem banco.
- **E2E:** `test/app.e2e-spec.ts`
- **Mocks:** `test/mocks/`

Ver `test/README.md` para detalhes.

## Infraestrutura

Deploy em EC2 via **Terraform** (pasta `terraform/`). Ver `terraform/README.md`.

## Licença

UNLICENSED (projeto privado).
