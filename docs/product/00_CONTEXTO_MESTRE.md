# 00 - Contexto Mestre

## Produto

Giant Projects é o módulo do ecossistema Giant Manager para gestão executiva de projetos. O objetivo é substituir controles dispersos em planilhas, Planner e apresentações manuais por uma plataforma web responsiva, premium e orientada a decisão.

## Proposta de Valor

- Visão executiva consolidada do portfólio.
- Controle de status, fases, atividades, riscos, pendências e próximos passos.
- Status report operacional e executivo com dados estruturados.
- Base pronta para evoluir de read-only para operação completa com CRUD, governança e automação.

## Público Principal

- Executivos e sponsors.
- PMO.
- Gerentes de projeto.
- Key users e participantes operacionais.
- Clientes ou stakeholders com visão executiva.

## Stack Atual

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui.
- Prisma.
- PostgreSQL/Supabase.

## Estado Atual do Produto

A fundação read-only executiva foi concluída, com páginas principais conectadas ao Supabase e visual premium consistente.

Rotas estabilizadas:

- `/dashboard`
- `/projects`
- `/projects/[projectId]`
- `/projects/[projectId]/risks`
- `/projects/[projectId]/issues`
- `/projects/[projectId]/status-report`
- `/my-actions`
- `/templates`
- `/admin/*`

A próxima fase funcional prevista é iniciar a fundação de edição operacional controlada.
