# 02 - Padrao PO-Codex v2.0

## Entrada Valida

O Codex pode iniciar trabalho a partir de uma issue aprovada ou de um prompt formal aprovado pelo PO, desde que contenha:

- objetivo;
- escopo;
- fora do escopo;
- criterios de aceite;
- validacoes esperadas.

## Regra Principal

Entregar primeiro a alteracao funcional, segura e validada. Melhorias nao impeditivas entram no backlog.

## Escopo Congelado

Depois do inicio da implementacao, permanece na branch apenas o que for:

- impedimento real;
- falha funcional;
- regressao;
- risco de dados;
- risco de seguranca;
- criterio de aceite nao atendido.

Nao realizar auditoria global, refatoracao ampla ou melhoria nao relacionada sem pedido explicito do PO.

## Validacao

A validacao deve ser proporcional ao risco:

- mudanca documental ou script isolado: validacao direcionada;
- fluxo funcional: validacao tecnica e rota afetada;
- banco, seguranca ou CI: validacao ampliada.

O esperado e uma rodada consolidada de correcao. Se surgir melhoria nao bloqueante apos isso, registrar no backlog.

## PR e Merge

- Sempre usar branch e PR.
- Merge sempre humano.
- PR deve informar entregas, validacoes, impacto em banco, fora do escopo preservado e limitacoes.
- Relatorio final deve ser compacto.

## Guardrails

- Nunca versionar `.env`, tokens ou credenciais.
- Mudanca de banco exige autorizacao explicita: `altera banco`.
- Codex nao deve alterar schema, migrations ou seed sem essa autorizacao.
- Codigo e documentos versionados prevalecem sobre memoria de conversa.
