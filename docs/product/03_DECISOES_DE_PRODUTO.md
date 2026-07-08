# 03 - Decisões de Produto

## Decisões Fechadas

### Read-only Executive Platform Foundation

A fundação read-only foi considerada concluída após estabilizar dashboard, projetos, detalhe, riscos, pendências, status report, minhas ações, templates e administração.

### Banco

Supabase/PostgreSQL é o banco principal validado para a aplicação. Prisma é a camada oficial de acesso a dados.

### Automação PO -> Codex

A primeira etapa de automação deve ser leve e controlada:

- Templates de issue e PR.
- `AGENTS.md` na raiz.
- Documentação de produto em `docs/product`.
- Workflow que reage à label `ready-for-codex` e apenas comenta na issue.

Não haverá merge automático nem automação de e-mail nesta fase.

### CRUD

A fundação de CRUD deve começar por edição dos dados principais do projeto, antes de fases, atividades, riscos e pendências.

## Decisões Pendentes

- Definir padrão definitivo de autenticação.
- Definir política de permissões por perfil.
- Definir se `health` será campo próprio ou continuará derivado de snapshot/status report.
- Definir padrão de auditoria para alterações operacionais.
- Validar se o comentário automático com `@codex` dispara o fluxo desejado ou se será necessário usar uma action dedicada.

## Histórico de Versões

- V0.1: Visual shell executivo.
- V0.2: Prisma schema e seed inicial.
- V0.2.1: Supabase migration e seed validation.
- V0.3: `/projects` conectado ao banco.
- V0.3.1: detalhe do projeto conectado ao banco.
- V0.3.2: riscos e pendências conectados ao banco.
- V0.3.3: status report conectado ao banco.
- V0.4: dashboard conectado ao banco.
- V0.4.1: QA de consistência read-only.
- V0.4.2: consistência visual das páginas operacionais.
- Próxima etapa recomendada: V0.5.1 - edição dos dados principais do projeto.
