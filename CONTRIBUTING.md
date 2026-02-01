# Guia de Contribuição

## 🚀 Começando

### 1. Clone e instale dependências

```bash
git clone <repo-url>
cd short-url-api
npm install
```

### 2. Configure o ambiente

```bash
cp .env.example .env
# Edite o .env com suas configurações
```

### 3. Suba o banco de dados

```bash
docker compose up -d db
npx prisma migrate deploy
```

## 📝 Fluxo de Desenvolvimento

### 1. Crie uma branch

```bash
git checkout -b feature/minha-feature
# ou
git checkout -b fix/meu-bugfix
```

### 2. Desenvolva e teste

```bash
# Desenvolvimento com hot-reload
npm run start:dev

# Rodar testes
npm test

# Rodar testes em modo watch
npm run test:watch

# Ver logs detalhados dos testes
npm run test:verbose
```

### 3. Verifique o código

```bash
# Lint
npm run lint

# Formatar código
npm run format

# Testes com cobertura
npm run test:cov
```

### 4. Commit suas mudanças

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
```

**O que acontece no commit:**
- ✅ ESLint verifica e corrige arquivos modificados
- ✅ Prettier formata arquivos modificados
- ✅ Testes unitários relacionados são executados

Se alguma verificação falhar, o commit é **cancelado**.

### 5. Push para o repositório

```bash
git push origin feature/minha-feature
```

**O que acontece no push:**
- ✅ ESLint verifica **todos** os arquivos
- ✅ **Todos** os testes são executados

Se alguma verificação falhar, o push é **cancelado**.

## 🎯 Convenções

### Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
test: adiciona ou corrige testes
refactor: refatora código
style: mudanças de formatação
chore: tarefas de manutenção
```

**Exemplos:**
```bash
git commit -m "feat: adiciona endpoint de estatísticas"
git commit -m "fix: corrige validação de email"
git commit -m "test: adiciona testes para UserController"
git commit -m "docs: atualiza README com instruções Docker"
```

### Código

- Use **TypeScript** com tipos explícitos
- Siga o padrão **DDD** (Domain-Driven Design)
- Escreva **testes** para novas funcionalidades
- Mantenha **cobertura de testes** alta
- Use **DTOs** para validação de entrada
- Use **mappers** para transformar entidades em responses

### Estrutura de Pastas

```
src/
├── application/      # Use cases, DTOs, mappers
├── domain/          # Entidades, interfaces de repositórios
├── infrastructure/  # Implementações de repositórios
├── presentation/    # Controllers, guards, decorators
└── modules/         # Módulos NestJS

test/
├── unit/           # Testes unitários
├── mocks/          # Mocks reutilizáveis
└── *.e2e-spec.ts   # Testes E2E
```

## 🧪 Testes

### Testes Unitários

- Localizados em `test/unit/`
- Usam **mocks** (não acessam banco)
- Devem ser **rápidos** (< 5s total)

```bash
# Rodar todos os testes unitários
npm test -- --testPathPatterns="test/unit"

# Rodar teste específico
npm test -- user.controller.spec.ts

# Com logs detalhados
npm run test:verbose
```

### Testes E2E

- Localizados em `test/`
- Testam fluxo completo da aplicação
- Podem usar banco de dados de teste

```bash
npm run test:e2e
```

### Criando Novos Testes

Use o template em `test/unit/TEMPLATE.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { createMockResponse } from '../../mocks';

describe('MyComponent', () => {
  // ... implementação
});
```

## 🔧 Troubleshooting

### Hook está falhando

```bash
# Ver o que está falhando
git commit -m "test" --verbose

# Rodar verificações manualmente
npm run lint
npm test
```

### Pular hooks (emergências apenas!)

```bash
git commit -m "mensagem" --no-verify
git push --no-verify
```

⚠️ **Atenção:** Isso pode quebrar o CI/CD!

### Reinstalar hooks

```bash
npm run prepare
chmod +x .husky/pre-commit .husky/pre-push
```

## 📚 Recursos

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Jest Documentation](https://jestjs.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [DDD Pattern](https://martinfowler.com/bliki/DomainDrivenDesign.html)

## 🤝 Dúvidas?

- Abra uma issue
- Consulte a documentação em `README.md`
- Veja exemplos nos testes existentes
