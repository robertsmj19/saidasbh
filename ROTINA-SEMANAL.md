# Rotina semanal de eventos (planejada, ainda não ativada)

Isso cobre o item "Eventos da semana" das Pendências do CLAUDE.md: hoje eu atualizo o `EVPAD` manualmente; aqui está o desenho e o prompt pra isso virar uma rotina automática na nuvem (`/schedule`), publicando sozinha toda segunda.

## Falta antes de ativar

1. Subir o projeto pro GitHub e ligar o GitHub Pages (hoje é só uma pasta local, sem git). A rotina na nuvem clona de um repositório, não tem como apontar pra essa pasta.
2. A cota de busca da sessão atual renovar (ficou travada depois da busca de Instagram). Quando renovar, testamos a rotina rodando ela uma vez manualmente antes de deixar no automático.

## Agentes e modelos

A rotina roda como uma sessão na nuvem (Claude Code) que se organiza em três papéis, usando a própria ferramenta Agent pra dividir o trabalho:

1. **Planejamento** — só pesquisa, não edita nada. Subagente novo, modelo **Sonnet 5.5**. Visita as 4 fontes e devolve um JSON com os eventos candidatos da semana.
2. **Execução** — a sessão principal da rotina (não delega). Modelo **Sonnet 5.5**. Pega o JSON do planejamento, edita o `EVPAD` no `index.html`, roda os scripts de geocodificação/social pra local novo, testa a sintaxe.
3. **Revisão** — subagente novo, sem nenhum contexto do planejamento ou da execução (de propósito, pra não repetir os mesmos pontos cegos). Modelo **Opus 5.5** (mais criterioso — é o único filtro antes de publicar sozinho, sem humano olhando).

## Backup antes de mexer

Antes de qualquer edição, a rotina:
- Confere que a árvore git está limpa (`git status`); se não estiver, para e não continua.
- Cria uma tag no HEAD atual: `git tag backup/pre-update-AAAA-MM-DD`.
- Copia `index.html`, `dados/coords.json` e `dados/social.json` pra `backups/AAAA-MM-DD/`.

Se algo der errado, dá pra voltar com `git reset --hard backup/pre-update-AAAA-MM-DD` ou restaurando os arquivos copiados.

## Como saber que deu certo

A cada execução, a rotina grava uma seção em `logs/rotina-eventos.md` com:
- quantas das 4 fontes responderam;
- quantos eventos o planejamento propôs, quantos a revisão aprovou/reprovou (e por quê);
- quantos eventos antigos (mais de 14 dias expirados) foram removidos;
- se o teste de sintaxe do JS passou;
- a tag de backup criada;
- o hash do commit publicado (ou o erro, se o push falhou).

Esse log é o que te diz se deu certo sem precisar abrir a sessão na nuvem toda vez.

## Agenda sugerida

Toda segunda, 8h de Brasília = 11h UTC → cron `0 11 * * 1`. (Dá pra ajustar o horário.)

## Prompt completo (pronto pra colar quando formos criar a rotina)

```
Você é uma rotina automática semanal do projeto "Saídas em BH" (app pessoal de
passeios em Belo Horizonte, publicado no GitHub Pages). Você não tem contexto
de nenhuma conversa anterior — tudo que precisa está aqui e no repositório.

Primeiro, leia o CLAUDE.md na raiz do repositório inteiro. Ele descreve o
projeto, as regras de dados, e a seção "Pendências" explica a atualização
semanal de eventos que você vai fazer agora. Siga sempre as regras de lá
(nunca inventar preço/horário, sempre linkar a fonte, etc).

Sua tarefa, em 5 fases, nessa ordem:

FASE 0 — Backup
- Confirme que a árvore de trabalho está limpa (git status). Se não estiver,
  pare e não continue.
- Crie uma tag git no HEAD atual: git tag backup/pre-update-$(date +%Y-%m-%d)
- Copie index.html, dados/coords.json e dados/social.json para
  backups/$(date +%Y-%m-%d)/ (crie a pasta).

FASE 1 — Planejamento (delegue a um subagente, não faça você mesma)
- Use a ferramenta Agent (subagent_type general-purpose, model sonnet) com uma
  tarefa SÓ de pesquisa — esse subagente não deve editar nenhum arquivo.
- Calcule a semana alvo: de segunda a domingo a partir de hoje (ou a próxima
  segunda, se hoje não for segunda).
- Peça pro subagente visitar Portal BH (portalbelohorizonte.com.br), Clib
  (clib.com.br), Agenda Cultural BH e Circuito Liberdade e listar os eventos
  da semana alvo que fazem sentido pro público do app: pessoa que trabalha em
  home office, faz doutorado, tem pouco tempo livre — prioriza grátis ou
  barato, cultural, música, teatro, exposição; evita eventos muito caros ou
  muito nichados.
- Peça que o resultado seja um JSON array, um objeto por evento, com estes
  campos: nome, data_inicio (ISO com fuso -03:00), data_fim (só se diferente
  de data_inicio), hora_conhecida (true só se a fonte confirmar o horário),
  local, preco (número; 0 se gratuito; null se não achar — nunca inventado),
  obs (opcional, texto curto), link (url da fonte usada pra esse evento
  específico), fontes (array com o nome do site, ex: ["Clib"]), ico (um
  emoji que combine com o evento).
- Regra inegociável, repita pro subagente: nunca inventar preço, horário ou
  link. Se não confirmar um dado, deixa null/vazio.
- Esse subagente só devolve o JSON na resposta dele, não mexe em arquivo
  nenhum.

FASE 2 — Execução (você mesma, não delegue)
- Pegue o JSON do subagente de planejamento.
- Abra o index.html e ache o array EVPAD.
- Pra cada evento novo: confira se já existe uma entrada idêntica (mesmo
  nome + local + data_inicio) pra não duplicar; se não existir, adicione
  como um novo objeto literal no array, no mesmo formato dos itens já
  existentes.
- Remova do EVPAD qualquer entrada cujo data_fim (ou data_inicio se não
  tiver data_fim) seja mais de 14 dias no passado.
- Pra local novo que não seja "CCBB", "Palácio das Artes" ou "Parque
  Municipal" (veja a função eventLugar/eventItems no index.html pra saber
  como esses nomes são comparados), rode:
  node scripts/geocode.js && node scripts/embed-coords.js
  node scripts/build-social.js && node scripts/embed-social.js
- Rode o teste de sintaxe do JS (extrair o <script> do index.html e rodar
  com node -e "...new Function(code)...", documentado no CLAUDE.md em "Como
  trabalhar aqui"). Se der erro de sintaxe, desfaça a edição e pare — não
  prossiga pra fase de revisão.

FASE 3 — Revisão (delegue a um subagente NOVO, sem contexto da fase 1/2)
- Use a ferramenta Agent (subagent_type general-purpose, model opus).
- Dê pra esse subagente: o diff do EVPAD (git diff do index.html, só a parte
  do EVPAD) e peça que ele leia o CLAUDE.md pras regras.
- Peça uma auditoria crítica, item por item: tem link e fonte? nenhum
  preço/horário parece inventado? as datas batem com a semana alvo? não tem
  duplicado? os campos estão bem formados (JS válido)? Resposta estruturada:
  PASS ou FAIL por item, com o motivo de cada FAIL.
- Se tiver FAIL: remova só as entradas reprovadas do EVPAD (não refaça a
  rodada toda), rode o teste de sintaxe de novo, e anote no log quais foram
  descartadas e por quê.
- Limite de 2 rodadas de revisão. Se ainda sobrar reprovado na segunda,
  descarte e siga só com o que passou.

FASE 4 — Log, commit e publicação
- Crie/atualize logs/rotina-eventos.md, acrescentando uma seção com a data
  de hoje e: quantas fontes responderam (de 4); quantos eventos propostos,
  aprovados e reprovados (e por quê); quantos eventos antigos removidos; se
  o teste de sintaxe passou; a tag de backup criada.
- Faça commit de tudo que mudou (index.html, dados/coords.json,
  dados/social.json, logs/rotina-eventos.md) com mensagem curta tipo
  "Atualiza eventos da semana de D/M a D/M". Dê push direto pro branch main
  (essa rotina publica sozinha, sem revisão humana).
- Se o push falhar por qualquer motivo, NÃO force (sem --force): registre o
  erro no log e pare.

FASE 5 — Resumo final
- Termine com um resumo curto: quantos eventos entraram, quantos saíram, se
  deu tudo certo ou algo ficou pendente, e o hash do commit feito.
```
