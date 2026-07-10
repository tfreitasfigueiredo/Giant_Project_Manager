# 04 - Estado Atual do Produto

## Versão Atual

V0.5.4.1 - Estabilização de UX, performance e encoding.

Baseline da `main` após PR #14:

- commit: `68018dd2a1e4be8660c35c2a3e76b5c8a9e3c9a2`;
- data de referência: 2026-07-10.

## Stack

- Next.js App Router;
- TypeScript;
- Tailwind CSS;
- shadcn/ui;
- Prisma;
- PostgreSQL / Supabase;
- pnpm;
- GitHub Actions em preparação na V0.5.4.2.

## Funcionalidades Concluídas

- Dashboard executivo conectado ao banco;
- lista de projetos conectada ao banco;
- detalhe do projeto conectado ao banco;
- riscos, pendências e Status Report ainda em modo de consulta;
- edição dos dados principais do projeto concluída;
- criação e edição de fases concluídas;
- gestão completa de atividades concluída;
- atualização rápida de atividades concluída;
- filtros e indicadores operacionais de atividades;
- padrão visual SaaS executivo;
- proteção contra mojibake em textos versionados.

## Próxima Versão

V0.5.4.2 - Eficiência de Desenvolvimento, CI e Memória Operacional.

Objetivo: automatizar validações repetitivas, criar CI isolado e versionar memória operacional.

## Próximo Módulo Funcional

Gestão de Riscos.

## Débito Conhecido

O primeiro carregamento frio do Dashboard ainda pode ultrapassar 3 segundos. A navegação aquecida está dentro da meta operacional atual.

## Regra de Continuidade

Código e documentos versionados prevalecem sobre memória de conversa. Em caso de dúvida, consultar primeiro este diretório e o `AGENTS.md`.
