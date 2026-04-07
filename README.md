# AI Project Orchestrator Demo

Demo publica, visual y funcional de un producto conceptual donde un **orquestador central** recibe eventos del proyecto y genera impacto, decisiones, tareas y artefactos para cinco roles:

- Diseno (UI/UX y reglas visuales)
- Backend (APIs y logica de negocio)
- Frontend (pantallas e integracion)
- PM (deadlines, riesgos y seguimiento)
- PO (objetivos, prioridades y alcance)

## Problema que resuelve

Los equipos reciben cambios constantes y cada rol los interpreta por separado.  
Esta demo muestra un enfoque de **cerebro unico** con contexto compartido que:

- procesa eventos de proyecto,
- determina impacto cruzado,
- entrega salidas consistentes por rol,
- deja trazabilidad de decisiones.

## Como funciona la demo

1. Cargas un estado inicial vivo del proyecto (Project Atlas).
2. Simulas eventos desde la UI (catalogo predefinido).
3. El orquestador central procesa el evento.
4. Se actualiza:
   - contexto global,
   - timeline,
   - decision global,
   - trazabilidad de impacto cruzado,
   - tareas/bloqueos/dependencias/artefactos por rol.

## Stack

- Frontend: React + Vite + Tailwind CSS (JavaScript/JSX)
- Backend: Node.js + Express
- Persistencia: en memoria (seed mock)
- Arquitectura: frontend/backend separados, orquestador modular

## Estructura del proyecto

```txt
ai-project-orchestrator-demo/
  backend/
    src/
      controllers/
      domain/
      mock/
      orchestrator/
      routes/
      services/
  frontend/
    src/
      components/
      data/
      services/
```

## Eventos incluidos

- PO cambia prioridad: onboarding prioridad 1
- Disenador cambia regla: stepper + validacion inline
- PM mueve deadline: MVP una semana antes
- Backend cambia contrato: nuevo campo en registro
- Frontend reporta bloqueo: falta contrato definitivo
- PO agrega objetivo: reducir friccion y aumentar activacion

## Ejecutar localmente

### 1) Instalar dependencias

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 2) Levantar backend

```bash
npm run dev:backend
```

Backend en `http://localhost:4000`.

### 3) Levantar frontend

En otra terminal:

```bash
npm run dev:frontend
```

Frontend en `http://localhost:5173`.

## Endpoints backend

- `GET /health`
- `GET /api/project-state`
- `GET /api/events`
- `POST /api/events/trigger` con body `{ "eventTemplateId": "..." }`
- `POST /api/reset`

## Deploy recomendado (simple)

### Frontend

- Vercel o Netlify
- Build command: `npm run build --prefix frontend`
- Publish dir: `frontend/dist`
- Variable env: `VITE_API_URL=<url-del-backend>/api`

### Backend

- Railway / Fly.io / Render
- Start command: `npm run start --prefix backend`
- Puerto por variable `PORT`

## Modo Demo vs AI-ready

- **Demo mode (actual):** reglas deterministicas y convincentes, sin APIs pagas.
- **AI-ready mode (preparado):** el punto de integracion esta en `backend/src/services/orchestratorService.js`.

Para conectar IA real (OpenAI, Ollama, etc):

1. Agregar metodo `handleEventWithLLM(state, event)` en `orchestratorService`.
2. Mantener el mismo contrato de salida (decision, trazabilidad, artefactos, actualizacion de estado).
3. Conmutar por modo/config sin romper frontend.

## Roadmap sugerido

- Persistencia real (Postgres/Redis)
- Historial multi-proyecto y usuarios
- Versionado de decisiones y artefactos
- Motor de reglas hibrido (heuristico + LLM)
- Colaboracion en tiempo real y auditoria

