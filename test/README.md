# Estrutura de Testes

Este diretório contém todos os testes do projeto, organizados por tipo e responsabilidade.

## Estrutura de Pastas

```
test/
├── unit/                    # Testes unitários
│   └── controllers/         # Testes dos controllers
│       ├── user.controller.spec.ts
│       ├── auth.controller.spec.ts
│       ├── short-url.controller.spec.ts
│       └── redirect.controller.spec.ts
├── mocks/                   # Mocks reutilizáveis
│   ├── user.mock.ts         # Mocks de User
│   ├── short-url.mock.ts    # Mocks de ShortUrl
│   ├── express.mock.ts      # Mocks do Express (Response)
│   └── index.ts             # Barrel file
├── app.e2e-spec.ts          # Testes E2E
├── jest-e2e.json            # Configuração Jest E2E
└── README.md                # Este arquivo

```

## Tipos de Testes

### Testes Unitários (`unit/`)

Testes isolados de componentes individuais (controllers, services, use cases) usando mocks para todas as dependências. **Não acessam o banco de dados**.

**Localização:** `test/unit/`

**Como rodar:**
```bash
npm test -- --testPathPatterns="unit/"
```

### Testes E2E (`*.e2e-spec.ts`)

Testes de integração end-to-end que testam o fluxo completo da aplicação, incluindo requisições HTTP reais.

**Localização:** `test/*.e2e-spec.ts`

**Como rodar:**
```bash
npm run test:e2e
```

## Mocks Reutilizáveis (`mocks/`)

Contém dados mockados e funções auxiliares para criar mocks consistentes em todos os testes.

### Mocks Disponíveis

- **`user.mock.ts`**: Entidades e responses de usuários
  - `mockUserEntity`: UserEntity completa
  - `mockUserResponse`: Response DTO
  - `createMockUser()`: Factory para criar usuários customizados

- **`short-url.mock.ts`**: Entidades e responses de URLs encurtadas
  - `mockShortUrlEntity`: ShortUrlEntity completa
  - `mockShortUrlResponse`: Response DTO
  - `createMockShortUrl()`: Factory para criar URLs customizadas

- **`express.mock.ts`**: Mocks do Express
  - `createMockResponse()`: Cria mock de Response com métodos spy

### Exemplo de Uso

```typescript
import { mockUserEntity, createMockUser, createMockResponse } from '../../mocks';

// Usar mock padrão
const user = mockUserEntity;

// Criar mock customizado
const customUser = createMockUser({ 
  id: 2, 
  email: 'custom@example.com' 
});

// Criar mock de Response
const mockResponse = createMockResponse();
```

## Convenções

1. **Nomenclatura**: Arquivos de teste devem terminar com `.spec.ts` (unitários) ou `.e2e-spec.ts` (E2E)
2. **Organização**: Espelhar a estrutura de `src/` dentro de `test/unit/`
3. **Mocks**: Centralizar mocks reutilizáveis em `test/mocks/`
4. **Isolamento**: Testes unitários não devem acessar banco de dados ou APIs externas
5. **Limpeza**: Usar `afterEach(() => jest.clearAllMocks())` para limpar mocks entre testes

## Cobertura de Testes

Para gerar relatório de cobertura:

```bash
npm run test:cov
```

O relatório será gerado em `coverage/`.

## Comandos Úteis

```bash
# Rodar todos os testes
npm test

# Rodar testes em modo watch
npm test -- --watch

# Rodar apenas testes de controllers
npm test -- --testPathPatterns="controllers"

# Rodar teste específico
npm test -- user.controller.spec.ts

# Rodar com cobertura
npm run test:cov

# Rodar testes E2E
npm run test:e2e
```
