# 02 - Padrão PO-Codex v2.0

## Entrada Válida

O Codex pode iniciar trabalho a partir de uma issue aprovada ou de um prompt formal aprovado pelo PO, desde que contenha:

- objetivo;
- escopo;
- fora do escopo;
- critérios de aceite;
- validações esperadas.

## Regra Principal

Entregar primeiro a alteração funcional, segura e validada. Melhorias não impeditivas entram no backlog.

## Escopo Congelado

Depois do início da implementação, permanece na branch apenas o que for:

- impedimento real;
- falha funcional;
- regressão;
- risco de dados;
- risco de segurança;
- critério de aceite não atendido.

Não realizar auditoria global, refatoração ampla ou melhoria não relacionada sem pedido explícito do PO.

## Validação

A validação deve ser proporcional ao risco:

- mudança documental ou script isolado: validação direcionada;
- fluxo funcional: validação técnica e rota afetada;
- banco, segurança ou CI: validação ampliada.

O esperado é uma rodada consolidada de correção. Se surgir melhoria não bloqueante após isso, registrar no backlog.

## PR e Merge

- Sempre usar branch e PR.
- Merge sempre humano.
- PR deve informar entregas, validações, impacto em banco, fora do escopo preservado e limitações.
- Relatório final deve ser compacto.

## Guardrails

- Nunca versionar `.env`, tokens ou credenciais.
- Mudança de banco exige autorização explícita: `altera banco`.
- Codex não deve alterar schema, migrations ou seed sem essa autorização.
- Código e documentos versionados prevalecem sobre memória de conversa.
