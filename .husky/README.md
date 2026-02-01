# Git Hooks com Husky

Este projeto usa [Husky](https://typicode.github.io/husky/) para executar verificações automáticas antes de commits e pushes.

## Hooks Configurados

### 🔒 Pre-commit

Executado **antes de cada commit**. Garante qualidade do código que será commitado.

**Verificações:**
- ✅ **Lint** (apenas arquivos modificados) - ESLint com correção automática
- ✅ **Format** (apenas arquivos modificados) - Prettier
- ✅ **Testes unitários** (modo verbose) - Mostra cada teste executado com ✓

**Como funciona:**
```bash
git add .
git commit -m "mensagem"
# → Hook executa automaticamente
# → Se falhar, o commit é cancelado
```

### 🚀 Pre-push

Executado **antes de cada push**. Garante que o código no repositório remoto está íntegro.

**Verificações:**
- ✅ **Lint completo** - Verifica todos os arquivos do projeto
- ✅ **Todos os testes** (modo verbose) - Unitários com logs detalhados

**Como funciona:**
```bash
git push
# → Hook executa automaticamente
# → Se falhar, o push é cancelado
```

## Benefícios

1. **Qualidade garantida** - Código sempre passa por lint e testes antes de ser commitado
2. **Feedback rápido** - Erros detectados localmente, antes do CI/CD
3. **Consistência** - Todos os desenvolvedores seguem as mesmas regras
4. **Economia de tempo** - Evita commits/pushes que falhariam no CI

## Bypass (Emergências)

Em casos excepcionais, você pode pular os hooks:

```bash
# Pular pre-commit
git commit -m "mensagem" --no-verify

# Pular pre-push
git push --no-verify
```

⚠️ **Atenção:** Use apenas em emergências! O código pode quebrar o CI/CD.

## Comandos Manuais

Você pode executar as verificações manualmente:

```bash
# Lint nos arquivos modificados
npx lint-staged

# Lint completo
npm run lint

# Testes unitários
npm test -- --testPathPatterns="test/unit"

# Todos os testes
npm test
```

## Troubleshooting

### Hook não está executando

1. Certifique-se de que os hooks têm permissão de execução:
   ```bash
   chmod +x .husky/pre-commit .husky/pre-push
   ```

2. Reinstale o Husky:
   ```bash
   npm run prepare
   ```

### Hook está muito lento

- **Pre-commit** usa `--findRelatedTests` (rápido, apenas testes relacionados)
- **Pre-push** executa tudo (mais lento, mas garante integridade completa)

Se ainda estiver lento, considere:
- Executar apenas testes unitários no pre-push
- Deixar E2E apenas para o CI/CD

### Desabilitar hooks temporariamente

Renomeie a pasta `.husky`:
```bash
mv .husky .husky.disabled
```

Para reativar:
```bash
mv .husky.disabled .husky
```

## Estrutura

```
.husky/
├── pre-commit       # Hook de pre-commit
├── pre-push         # Hook de pre-push
└── README.md        # Este arquivo
```

## Configuração do lint-staged

Definida em `package.json`:

```json
{
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

Isso garante que apenas arquivos TypeScript modificados sejam verificados e formatados.
