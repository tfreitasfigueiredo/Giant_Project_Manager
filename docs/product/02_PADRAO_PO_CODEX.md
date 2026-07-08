# 02 - Padrão PO -> Codex

## Fluxo Padrão

1. PO cria issue com objetivo, contexto, escopo, fora de escopo e critérios de aceite.
2. PO revisa se há risco de banco, autenticação, segurança ou mudança visual ampla.
3. PO aplica a label `ready-for-codex` apenas quando a issue estiver pronta.
4. Workflow comenta na issue com instrução para o Codex.
5. Codex cria branch, implementa, valida e abre PR.
6. PO revisa arquivos alterados, valida escopo e aprova ou pede ajuste.
7. Merge é sempre humano.

## Estrutura de Prompt Esperada

Toda tarefa para Codex deve conter:

- Contexto.
- Objetivo.
- Escopo obrigatório.
- Fora de escopo.
- Tarefas técnicas.
- Critérios de aceite.
- Validações obrigatórias.
- Commit esperado, quando aplicável.

## Guardrails

- Nunca enviar e-mail direto para Codex.
- Nunca fazer merge automático.
- Sempre usar issue antes do desenvolvimento.
- Sempre usar branch e PR.
- Sempre declarar critérios de aceite.
- Nunca incluir `.env`, tokens, secrets ou connection strings.
- Mudança de banco exige declaração explícita: `altera banco`.
- Codex deve informar rotas testadas, comandos rodados e arquivos alterados em todo PR.

## Como Revisar PRs do Codex

Antes do merge, conferir:

- Arquivos alterados batem com o escopo da issue.
- `.env` não aparece.
- Prisma não foi alterado sem autorização.
- Build, TypeScript e ESLint passaram.
- Rotas afetadas foram testadas.
- Não houve expansão de escopo.
- O resumo do PR explica limitações e próximos passos.
