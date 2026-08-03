# ADR 001: Seleção de Stack

**Status:** Aceito  
**Data:** 2026-08-01

## Contexto

O cliente precisa de um formulário de cadastro com persistência em banco de dados, com previsão de continuidade por outra equipe e deploy via Docker.

## Decisão

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Banco:** PostgreSQL 16
- **Infra:** Docker Compose + Nginx

## Justificativa

- **React + Vite:** ecossistema maduro, DX rápida, ampla adoção — facilita onboarding de nova equipe.
- **Express:** minimalista, flexível e com vasta comunidade. Para um CRUD simples, frameworks mais opinados (NestJS, Fastify) adicionariam complexidade desnecessária.
- **TypeScript em ambas camadas:** type safety end-to-end, reduz bugs em runtime e facilita manutenção.
- **PostgreSQL:** requisito do cliente. Robusto, ACID, suporta constraints (UNIQUE) nativamente.
- **Docker Compose:** atende o requisito de deploy via "imagem Docker" com orquestração simples.

## Alternativas consideradas

| Alternativa | Motivo da rejeição |
|-------------|-------------------|
| NestJS | Overhead de abstração para um único endpoint |
| MongoDB | Cliente especificou PostgreSQL |
| Next.js | SSR desnecessário para formulário simples |
| Prisma ORM | Camada adicional sem benefício claro para uma tabela |

## Consequências

- Equipe futura precisa conhecer React e Express (tecnologias amplamente conhecidas).
- Sem ORM — queries SQL diretas são mais transparentes mas requerem migrations manuais.
