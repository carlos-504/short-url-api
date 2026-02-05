# Arquitetura DDD

O projeto segue **Domain-Driven Design** com camadas horizontais e agregações por contexto.

## Regra de Dependência

```
presentation → application → domain
     ↑              ↑
infrastructure ─────┘
```

- **Domain** não depende de nada (camada mais interna).
- **Application** depende apenas do Domain (use cases orquestram o domínio).
- **Infrastructure** implementa contratos do Domain (repositórios, Prisma).
- **Presentation** consome Application (controllers chamam use cases).

## Estrutura de Pastas

```
src/
├── domain/              # Núcleo – entidades e contratos
│   ├── base-entity.ts   # Campos comuns (id, createdAt, updatedAt, deletedAt)
│   ├── short-url/       # Agregado ShortUrl
│   │   ├── entities/
│   │   └── repositories/  # Interface + token DI
│   └── user/            # Agregado User
│       ├── entities/
│       └── repositories/
│
├── application/         # Casos de uso
│   ├── short-url/       # Use cases, DTOs, mappers
│   ├── user/
│   └── auth/
│
├── infrastructure/      # Implementações
│   ├── shared/          # Utilitários (ex: mapPrismaToDomain)
│   ├── short-url/       # PrismaShortUrlRepository
│   └── user/            # PrismaUserRepository
│
├── presentation/        # HTTP, guards, JWT
│   ├── short-url/       # Controllers
│   ├── user/
│   └── auth/
│
├── modules/             # Módulos NestJS (wire-up)
├── shared/              # Cross-cutting (observability)
├── common/              # Utilitários compartilhados (http, pipes, utils)
├── config/              # Configurações
└── library/             # Clientes (Prisma)
```

## Onde Colocar o Quê

| O que | Onde |
|-------|------|
| Nova entidade | `domain/<aggregate>/entities/` |
| Novo repositório | `domain/<aggregate>/repositories/` (interface) + `infrastructure/<aggregate>/` (impl) |
| Novo use case | `application/<aggregate>/use-cases/` |
| Novo controller | `presentation/<aggregate>/controllers/` |
| DTO de entrada/saída | `application/<aggregate>/dtos/` |
| Mapper Entity→DTO | `application/<aggregate>/mappers/` |

## Princípios Aplicados

- **Domain puro**: entidades não importam Prisma ou frameworks.
- **Dependency Inversion**: application usa interfaces; infrastructure implementa.
- **DRY**: `BaseEntity` para campos comuns; `mapPrismaToDomain` reutilizável.
- **Aggregate owner**: cada agregado define seu token DI (ex: `SHORT_URL_REPOSITORY`).
