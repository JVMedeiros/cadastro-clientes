# Cadastro de Clientes

Aplicação fullstack para cadastro de clientes, desenvolvida com **React**, **Node.js**, **TypeScript** e **PostgreSQL**. Pronta para deploy via Docker.

## ⚡ Início rápido

```bash
docker compose up --build
```

Acesse **http://localhost** e pronto!

## 🏗️ Arquitetura

```
cadastro-clientes/
├── frontend/              # React + Vite + TypeScript
│   └── src/
│       ├── components/    # Componentes React
│       ├── lib/           # Validação (Zod) e API client
│       └── __tests__/     # Testes unitários (Vitest + Testing Library)
├── backend/               # Node.js + Express + TypeScript
│   └── src/
│       ├── routes/        # Rotas da API
│       ├── db/            # Pool de conexão e migrations
│       ├── shared/        # Validação e tipos compartilhados
│       └── __tests__/     # Testes unitários (Vitest)
├── docker-compose.yml     # Orquestração: frontend + backend + postgres
├── Dockerfile.frontend    # Build multi-stage com Nginx
├── Dockerfile.backend     # Build multi-stage com Node
└── nginx.conf             # Proxy reverso /api → backend
```

## 🔌 API

### `POST /api/clients`

Cria um novo cliente.

**Request body:**
```json
{
  "fullName": "João da Silva",
  "cpf": "529.982.247-25",
  "email": "joao@exemplo.com",
  "favoriteColor": "Azul",
  "notes": "Observação opcional"
}
```

**Sucesso (201):**
```json
{
  "success": true,
  "message": "Cadastro realizado com sucesso!",
  "clientId": 1
}
```

**Erro — dados inválidos (400):**
```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": [{ "field": "cpf", "message": "CPF inválido" }]
}
```

**Erro — duplicata (409):**
```json
{
  "success": false,
  "message": "CPF já cadastrado"
}
```

### `GET /api/clients/colors`

Retorna as cores disponíveis.

## 📋 Campos e validações

| Campo         | Tipo     | Obrigatório | Validação                                          |
|---------------|----------|-------------|-----------------------------------------------------|
| Nome completo | texto    | ✅          | Mín. 3, máx. 255 caracteres                        |
| CPF           | texto    | ✅          | Formato `000.000.000-00` + dígitos verificadores    |
| E-mail        | email    | ✅          | Formato válido + único no sistema                   |
| Cor preferida | seleção  | ✅          | Cores do arco-íris (configurável)                   |
| Observações   | textarea | ❌          | Máx. 1000 caracteres                                |

**Cores disponíveis:** Vermelho, Laranja, Amarelo, Verde, Azul, Anil, Violeta

> As cores são definidas como constante no código, facilitando alterações futuras.

## 🧪 Testes

```bash
# Backend (10 testes)
cd backend && npm test

# Frontend (7 testes)
cd frontend && npm test
```

**Cobertura:**
- Backend: validação de CPF (formato, dígitos, repetição), email, cores, campos obrigatórios
- Frontend: renderização do formulário, máscara de CPF, feedback de sucesso/erro/rede

## 🛠️ Desenvolvimento local

### Pré-requisitos

- Node.js 20+
- PostgreSQL (ou use `docker compose up db` para subir apenas o banco)

### Backend

```bash
cd backend
npm install
npm run dev        # Inicia em http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # Inicia em http://localhost:5173 (com proxy para API)
```

## 🐳 Docker

A aplicação roda com 3 containers:

| Serviço    | Porta | Descrição                       |
|------------|-------|---------------------------------|
| `frontend` | 80    | Nginx servindo SPA + proxy API  |
| `backend`  | 3001  | Express API                     |
| `db`       | 5432  | PostgreSQL 16                   |

```bash
docker compose up --build    # Primeira vez (build + start)
docker compose up            # Próximas vezes
docker compose down          # Parar
docker compose down -v       # Parar + remover dados
```

## 🧰 Tecnologias

| Camada   | Tecnologias                                           |
|----------|-------------------------------------------------------|
| Frontend | React 18, TypeScript, Vite, React Hook Form, Zod      |
| Backend  | Node.js, Express, TypeScript, Zod, node-postgres (pg)  |
| Banco    | PostgreSQL 16                                          |
| Infra    | Docker, Docker Compose, Nginx                          |
| Testes   | Vitest, Testing Library                                |

## 📝 Decisões técnicas

- **Zod** para validação em ambas camadas — mesmas regras no client e server
- **React Hook Form** para performance (uncontrolled inputs) e integração nativa com Zod
- **Validação real de CPF** com verificação dos dígitos calculados (não apenas formato)
- **Multi-stage Docker builds** para imagens menores em produção
- **Nginx como proxy reverso** — frontend e API na mesma origem, sem CORS em produção
- **Migration automática** no startup do backend (`CREATE TABLE IF NOT EXISTS`)
