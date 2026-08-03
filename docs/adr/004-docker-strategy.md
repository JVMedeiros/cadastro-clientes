# ADR 004: Estratégia de Docker e Deploy

**Status:** Aceito  
**Data:** 2026-08-01

## Contexto

O cliente informou que o primo "vai hospedar isso" usando Docker em "um serviço terceirizado". Precisamos de imagens otimizadas e orquestração simples.

## Decisão

- **Multi-stage builds** para frontend e backend
- **Docker Compose** para orquestração local e deploy
- **Nginx** como servidor do frontend e proxy reverso para a API

## Justificativa

### Multi-stage builds
- Stage de build instala todas as dependências e compila
- Stage de produção copia apenas os artefatos necessários
- Resultado: imagens menores, sem devDependencies, sem código-fonte TypeScript

### Nginx como proxy reverso
- Frontend e API respondem na **mesma origem** (porta 80)
- Elimina problemas de CORS em produção
- Nginx serve arquivos estáticos com performance superior ao Node
- Configuração de fallback (`try_files`) suporta SPA routing

### Docker Compose
- Um único `docker compose up` sobe toda a stack
- Healthcheck no PostgreSQL garante que o backend só inicia quando o banco está pronto
- Volume nomeado (`pgdata`) persiste dados entre restarts

## Alternativas consideradas

| Alternativa | Motivo da rejeição |
|-------------|-------------------|
| Kubernetes | Complexidade injustificada para uma aplicação simples |
| Serve estático via Express | Performance inferior ao Nginx para arquivos estáticos |
| Imagem única (monolito) | Viola separação de responsabilidades, builds mais lentos |

## Consequências

- Deploy requer apenas Docker e Docker Compose instalados.
- Escalar horizontalmente requer load balancer externo (fora do escopo atual).
- Migration roda automaticamente no startup — aceito para este estágio; em produção, considerar ferramenta de migration dedicada.
