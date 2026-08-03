# ADR 002: Estratégia de Validação

**Status:** Aceito  
**Data:** 2026-08-01

## Contexto

O formulário coleta dados sensíveis (CPF, e-mail) que exigem validação. A validação precisa acontecer no client (UX) e no server (segurança).

## Decisão

Usar **Zod** como biblioteca de validação em ambas as camadas, com schemas equivalentes no frontend e backend.

## Justificativa

- **Schema único define regras e tipos:** `z.infer<typeof schema>` gera o tipo TypeScript automaticamente, eliminando duplicação entre tipo e validação.
- **Validação de CPF com dígitos verificadores:** não basta validar formato (000.000.000-00). Implementamos o algoritmo oficial que calcula os dois dígitos verificadores, rejeitando CPFs com formato correto mas numericamente inválidos.
- **Dupla validação:** frontend valida para UX (feedback instantâneo), backend valida para segurança (nunca confiar no client).
- **Zod vs Yup/Joi:** Zod é TypeScript-first, tem bundle menor e inferência de tipos nativa.

## Consequências

- Schemas duplicados entre frontend e backend. Aceitável para um projeto deste tamanho — em projetos maiores, considerar monorepo com pacote compartilhado.
- CPFs válidos matematicamente mas não emitidos pela Receita Federal serão aceitos (validação de emissão requer consulta externa).
