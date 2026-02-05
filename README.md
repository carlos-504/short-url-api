# Short URL API

API REST em Node.js (NestJS) para encurtamento de URLs, cadastro e autenticação de usuários. Projeto organizado em camadas no padrão DDD.

**Ambiente em produção:** deploy em **instância EC2 da AWS**.

- **API:** [http://100.52.215.33:3000](http://100.52.215.33:3000)
- **Swagger:** [http://100.52.215.33:3000/api/docs](http://100.52.215.33:3000/api/docs)

## Requisitos

Apenas **Docker** e **Docker Compose**:

- **Docker** 24.x ou superior
- **Docker Compose** (plugin ou standalone) 2.x ou superior

## Como rodar o projeto

Sobe PostgreSQL e a aplicação em containers. Usa **Dockerfile.dev** (desenvolvimento com hot-reload).

**Passo 1:** Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

**Edite `.env` e defina `DATABASE_URL`, `JWT_SECRET` e `HASHIDS_SALT`.**

**Passo 2:** Execute o comando para subir os containers:

```bash
docker compose up --build -d
```

- **Banco:** PostgreSQL 16 na porta `5432` (usuário/senha/DB: `shorturl`/`shorturl`/`short_url_db`), ou use um banco externo via `DATABASE_URL`.
- **API:** `http://localhost:3000` (Swagger em `http://localhost:3000/api/docs`).
- **Volumes:** `./src` e `./prisma` montados (hot-reload).

O Docker Compose usa as variáveis do seu `.env`. Defina no mínimo:

- `DATABASE_URL` – para banco externo; se omitido, usa o PostgreSQL local do compose.
- `JWT_SECRET` – obrigatório.
- `HASHIDS_SALT` – obrigatório (salt para geração dos códigos encurtados).

**Comandos úteis:**

Para ver os logs:

```bash
docker compose logs -f app
```

Para parar:

```bash
docker compose down
```

**Se aparecer erro "Cannot find module":** reconstrua a imagem:

```bash
docker compose build --no-cache app
docker compose up -d
```

**Produção:** use `Dockerfile.prod` e configure as variáveis no ambiente de deploy.

## Variáveis de ambiente


| Variável                 | Obrigatória | Descrição                                          |
| ------------------------ | ----------- | -------------------------------------------------- |
| `DATABASE_URL`           | Sim         | URL de conexão PostgreSQL                          |
| `JWT_SECRET`             | Sim         | Segredo para assinatura dos tokens JWT             |
| `HASHIDS_SALT`           | Sim         | Salt para geração dos códigos encurtados (Hashids) |
| `PORT`                   | Não         | Porta do servidor (padrão: 3000)                   |
| `BCRYPT_SALT_ROUNDS`     | Não         | Rodadas do bcrypt (padrão: 10)                     |
| `OBSERVABILITY_ENABLED`  | Não         | Ativa observabilidade (`true`/`false`)             |
| `OBSERVABILITY_PROVIDER` | Não         | `sentry` | `console` | `noop`                      |
| `SENTRY_DSN`             | Não         | DSN do Sentry (quando provider=sentry)             |
| `NODE_ENV`               | Não         | `development` | `production`                       |
| `LOG_LEVEL`              | Não         | Nível de log (padrão: `info`)                      |
| `LOG_PRETTY`             | Não         | Saída legível dos logs (`true`/`false`)            |


A URL base das URLs encurtadas é obtida da requisição HTTP (Host + protocolo).

## Endpoints da API


| Método | Rota           | Descrição                                          |
| ------ | -------------- | -------------------------------------------------- |
| POST   | /auth/login    | Login (e-mail e senha). Retorna `accessToken`.     |
| POST   | /user          | Cadastro de usuário                                |
| POST   | /short-url     | Encurtar URL (com ou sem autenticação)             |
| GET    | /r/:code       | Redireciona e contabiliza cliques                  |
| GET    | /short-url     | Lista URLs do usuário (autenticado)                |
| PATCH  | /short-url/:id | Atualiza URL de destino (autenticado)              |
| DELETE | /short-url/:id | Exclusão lógica (autenticado)                      |
| GET    | /metrics       | Métricas Prometheus (quando observabilidade ativa) |


> **Swagger (documentação interativa da API):**  
> http://localhost:3000/api/docs

## Regras de negócio

- Código encurtado: no máximo 6 caracteres.
- Todo acesso (GET /r/:code) é contabilizado.
- Exclusão lógica (`deletedAt`).
- URLs base obtidas dinamicamente da requisição.

## Estratégia de encurtamento

O sistema usa **Hashids** para gerar códigos curtos a partir do ID numérico (auto-increment do banco).

### Como funciona

1. **Criação:** Ao encurtar uma URL, o banco gera um ID sequencial (1, 2, 3…).
2. **Codificação:** O ID é codificado com Hashids em um código alfanumérico de até 6 caracteres (ex.: `aZbKq7`).
3. **Redirecionamento:** Em `GET /r/:code`, o código é decodificado para obter o ID e buscar a URL de destino.
4. **Salt:** O `HASHIDS_SALT` ofusca os códigos — o mesmo ID com salts diferentes gera códigos diferentes.

### Vantagens dessa estratégia

| Vantagem | Descrição |
|----------|-----------|
| **Sem colisão** | IDs são únicos; cada código mapeia para um único registro. |
| **Compacto** | Códigos curtos (máx 6 chars) — URLs menores e mais legíveis. |
| **Determinístico** | Sem sorteio nem retry; criação em uma única operação. |
| **Reversível** | Decodificação direta do código para ID — lookup por índice primário. |
| **Ofuscado** | Salt impede adivinhar o próximo código ou enumerar IDs. |

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

## Escalabilidade horizontal – pontos de melhoria

O sistema atual escala verticalmente (uma instância EC2). Para escalar horizontalmente e manter o sistema sempre disponível, considere:

### 1. Load Balancer

- **ALB (Application Load Balancer) da AWS** na frente das instâncias da API.
- Distribui tráfego entre múltiplas instâncias e detecta instâncias com falha.
- Health checks em `/health` ou `/metrics` para retirar instâncias do pool quando indisponíveis.
- **Resultado:** alta disponibilidade e tolerância a falhas.

### 2. Banco de dados

- **PostgreSQL:** limitar conexões por instância (pool) e planejar o total de conexões.
- **RDS/Aurora:** gerenciar failover e read replicas para leitura.
- Considerar **connection pooling** (ex.: PgBouncer) se houver muitas instâncias.

### 3. Cache e redirecionamentos

- O endpoint `GET /r/:code` é o mais acessado.
- **Redis** (ou ElastiCache) para cachear redirecionamentos por `shortCode`.
- Reduz carga no PostgreSQL e melhora latência.
- **Desafio:** invalidação ao atualizar ou excluir uma URL.

### 4. Métricas e monitoramento

- Endpoint `/metrics` (Prometheus) já existente.
- Coletar métricas de todas as instâncias em um único Prometheus/Grafana.
- Usar **Sentry** para erros distribuídos.

### Resumo dos maiores desafios


| Desafio               | Solução                                      |
| --------------------- | -------------------------------------------- |
| Ponto único de falha  | Load Balancer + múltiplas instâncias         |
| Conexões com o banco  | Pool por instância + PgBouncer se necessário |
| Latência no redirect  | Cache Redis para `GET /r/:code`              |
| Métricas distribuídas | Prometheus/Grafana + Sentry                  |


## Licença

UNLICENSED (projeto privado).