# 04 - Estado Atual do Produto

## Versao Atual

V0.5.4.1 - Estabilizacao de UX, performance e encoding.

Baseline da `main` apos PR #14:

- commit: `68018dd2a1e4be8660c35c2a3e76b5c8a9e3c9a2`;
- data de referencia: 2026-07-10.

## Stack

- Next.js App Router;
- TypeScript;
- Tailwind CSS;
- shadcn/ui;
- Prisma;
- PostgreSQL / Supabase;
- pnpm;
- GitHub Actions em preparacao na V0.5.4.2.

## Funcionalidades Concluidas

- dashboard executivo conectado ao banco;
- lista de projetos conectada ao banco;
- detalhe do projeto conectado ao banco;
- riscos, pendencias e status report em modo read-only;
- edicao de dados principais do projeto;
- criacao e edicao de fases;
- gestao de atividades com criacao, edicao e atualizacao rapida;
- filtros e indicadores operacionais de atividades;
- padrao visual SaaS executivo;
- protecao contra mojibake em textos versionados.

## Proxima Versao

V0.5.4.2 - Eficiencia de Desenvolvimento, CI e Memoria Operacional.

Objetivo: automatizar validacoes repetitivas, criar CI isolado e versionar memoria operacional.

## Proximo Modulo Funcional

Gestao de Riscos.

## Debito Conhecido

O primeiro carregamento frio do Dashboard ainda pode ultrapassar 3 segundos. A navegacao aquecida esta dentro da meta operacional atual.

## Regra de Continuidade

Codigo e documentos versionados prevalecem sobre memoria de conversa. Em caso de duvida, consultar primeiro este diretorio e o `AGENTS.md`.
