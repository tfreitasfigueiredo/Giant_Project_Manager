---
name: Tarefa para Codex
about: Use este template para demandas que serão delegadas ao Codex
labels: []
assignees: ''
---

## Objetivo

Descreva em uma frase o resultado esperado.

## Contexto

Explique o estado atual, a versão relacionada e qualquer decisão de produto relevante.

## Escopo obrigatório

- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

## Fora de escopo

- [ ] O que o Codex não deve fazer
- [ ] O que deve permanecer inalterado

## Altera banco?

Marque uma opção:

- [ ] Não altera banco
- [ ] Altera banco

Se altera banco, detalhe explicitamente:

- schema:
- migrations:
- seed:
- impacto esperado:

## Critérios de aceite

- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

## Validações obrigatórias

- [ ] `pnpm exec tsc --noEmit`
- [ ] `pnpm exec eslint .`
- [ ] `pnpm build`

## Rotas a testar

- `/dashboard`
- `/projects`
- `/projects/boge`

## Observações de segurança

Não inclua `.env`, tokens, secrets, connection strings, senhas ou dados sensíveis nesta issue.

## Pronto para Codex

Aplique a label `ready-for-codex` somente depois que a issue estiver revisada e completa.
