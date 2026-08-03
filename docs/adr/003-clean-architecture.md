# ADR 003: Clean Architecture no Backend

**Status:** Aceito  
**Data:** 2026-08-03

## Contexto

O cliente mencionou que "pretende continuar esse projeto com outra equipe". Código organizado em camadas facilita onboarding, testes e evolução independente.

## Decisão

Separar o backend em 4 camadas:

```
Route → Controller → Service → Repository
```

- **Route:** define endpoints HTTP e conecta ao controller
- **Controller:** recebe request/response, delega ao service, não contém lógica de negócio
- **Service:** validação, regras de negócio, tratamento de erros de domínio
- **Repository:** acesso ao banco de dados, queries SQL
- **Middleware (error-handler):** tratamento centralizado de erros

## Justificativa

- **Testabilidade:** cada camada pode ser testada isoladamente com mocks/stubs.
- **Manutenibilidade:** trocar o banco (ex: PostgreSQL → MySQL) afeta apenas o repository.
- **Clareza de responsabilidade:** nova equipe entende onde cada tipo de lógica vive.
- **Error handling centralizado:** um único middleware trata ZodError, DuplicateEntryError e erros inesperados — routes/controllers ficam limpos.

## Alternativas consideradas

| Alternativa          | Motivo da rejeição                                                   |
| -------------------- | -------------------------------------------------------------------- |
| Tudo em uma rota     | Funciona para MVP mas não escala para equipe futura                  |
| Hexagonal completa   | Ports/adapters com interfaces seria overengineering para um endpoint |
| NestJS (built-in DI) | Dependência pesada demais para o escopo                              |

## Consequências

- Mais arquivos e indireção — aceitável pelo ganho em organização.
- Injeção de dependência manual (via construtor) — suficiente sem framework de DI.
