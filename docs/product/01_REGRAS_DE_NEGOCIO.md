# 01 - Regras de Negócio

## Governança de Projeto

- Projeto é a entidade central do módulo Giant Projects.
- Cada projeto pertence a um tenant e a uma empresa.
- Unidade, sponsor e gerente responsável podem ser opcionais conforme maturidade do cadastro.
- Status do projeto deve refletir a leitura executiva vigente.
- Saúde do projeto não é campo direto de `Project` no schema atual; ela é derivada de status, snapshot ou status report.

## Status Executivo

Status de projeto disponíveis no schema:

- `PLANNED`
- `ON_TRACK`
- `ATTENTION`
- `CRITICAL`
- `PAUSED`
- `COMPLETED`
- `CANCELLED`

Interpretação visual atual:

- `ON_TRACK`: no prazo.
- `ATTENTION`: atenção.
- `CRITICAL`: crítico.
- Outros status devem receber fallback visual seguro.

## Riscos

- Riscos pertencem a um projeto.
- Devem exibir severidade, impacto no go live, responsável e mitigação.
- Riscos altos/críticos devem aparecer em indicadores executivos.

## Pendências

- Pendências pertencem a um projeto.
- Devem exibir origem, responsável, prazo, impacto e próxima ação.
- Pendências críticas ou executivas impactam dashboards e alertas.

## Status Report

- Status report é read-only até existir etapa específica de edição/exportação.
- Conteúdo HTML deve ser renderizado com sanitização/filtro seguro.
- Status report deve refletir snapshot, riscos, pendências e próximos passos disponíveis.

## Banco de Dados

- Mudanças em schema, migrations ou seed exigem issue explicitamente marcada como `altera banco`.
- Nenhuma credencial deve aparecer em issue, prompt, commit ou PR.
- Acesso Prisma deve permanecer no servidor.
