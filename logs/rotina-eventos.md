
## 2026-11-06 (semana alvo: 9 a 15/11/2026)

- Fontes que responderam: 0 de 4. Portal BH, Clib, Agenda Cultural BH e Circuito Liberdade falharam por DNS (ENOTFOUND); os hosts não estão liberados na rede do ambiente da rotina. Confirmado também com curl.
- Eventos propostos: 0. Aprovados: 0. Reprovados: 0. A busca genérica não achou agenda confirmada com link real, então nada foi inventado.
- Eventos antigos removidos: 0 (nenhum terminava há mais de 14 dias).
- index.html não foi alterado, então o teste de sintaxe não foi necessário. A revisão (fase 3) foi dispensada por falta de entradas.
- Tag de backup: backup/pre-update-2026-11-06
- Pendente: liberar www.portalbelohorizonte.com.br, www.clib.com.br, www.agendaculturalbh.com.br e www.circuitoliberdade.com.br na rede do ambiente e atualizar o EVPAD da semana manualmente ou na próxima rodada.

## 2026-11-06, segunda rodada (semana alvo: 9 a 15/11/2026)

- Fontes que responderam: 4 de 4 (Portal BH abriu 5 páginas de evento; Clib, Agenda Cultural BH e Circuito Liberdade responderam sem eventos com link e dados confirmáveis; ccbb.com.br e minastenisclube.com.br seguem com erro de DNS).
- Eventos propostos: 6. Novos aprovados: 1 (Visita guiada ao Recinto de Imersão de Aves, Zoo BH, 14/11). Não adicionados: 3 já estavam no EVPAD (Meu Grito, A Foz do Contato, Mostra Entre Cantos e Resistências, Karamazovianas) e 1 (curso do Centro Cultural IDEA) por ter link não aberto e ser curso, não evento avulso.
- Reprovados na revisão: 0. A auditoria apontou que a coordenada nova do Nominatim para o Zoo estava errada (centro da cidade); corrigido mapeando `zoológico` para a chave `zoo` em `eventItems()`, e a coordenada nova foi descartada.
- Eventos antigos removidos: 0 (nenhum terminou há mais de 14 dias).
- Teste de sintaxe do JS: passou.
- Tag de backup: backup/pre-update-2026-11-06
- Pendente: domingo 8/11 e quarta 11/11 do Zoo (a fonte não lista as datas), preços e dias de eventos do CCBB (domínio sem acesso).

## 2026-11-06, terceira rodada (semana alvo: 9 a 15/11/2026)

- Fontes que responderam: 6 de 7. Palácio das Artes (3 propostos), Clib (7), Circuito Liberdade (2, CCBB), CCBB BH (4), Sesc Minas (2, completados pelo Clib), Cine Santa Tereza (1), Portal BH /eventos (1). Portal BH /eventos/gratuitos falhou com HTTP 404; as demais páginas do Portal BH só deram listagem.
- Eventos propostos: 16. Entraram 11 novos e 2 existentes (Karamazovianas, Eu e Meu Monstro) ganharam preço R$ 30 conferido no CCBB. Não entraram: Exposição de Longa Duração do CCBB (data de início inventada pelo pesquisador), Visões Táteis 5 (ano não confirmado na página), Cinema e Psicanálise Ata-me (página com data conflitante), Sonora Brasil (local e horário inconsistentes).
- Revisão (opus): 13 itens auditados, 12 aprovados e 1 reprovado em parte. Em "Mil maneiras de matar o tempo" o trecho "Diariamente, das 10h às 21h" não estava na página; foi trocado por "Em cartaz até 22/11." e o evento ficou.
- Eventos antigos removidos: 0 (nenhum terminou há mais de 14 dias).
- Geocodificação: Casa Fiat, Cine Santa Tereza e Alpendre 70 (bairro) resolvidos; Centro Cultural Unimed-BH Minas e Cine Theatro Brasil Vallourec caíram no centro da cidade (aproximado). Coordenada nova do Zoo descartada (errada, o Zoo usa a chave `zoo`).
- Teste de sintaxe do JS: passou.
- Tag de backup: backup/pre-update-2026-11-06 (cópia em backups/2026-11-06-2/, para não sobrescrever a anterior).

## 2026-11-09 (semana de 9/11 a 15/11)

- Fontes (7): 6 responderam, 1 falhou. Portal BH /eventos/gratuitos deu 404 (a /eventos abriu, mas sem eventos datados da semana). Clib abriu só a primeira parte da listagem (sem paginação acessível). Em Circuito Liberdade, as páginas de IDEA, Minas Tênis Clube e MM Gerdau não abriram no ambiente.
- Eventos úteis por fonte: Portal BH 6 (só da listagem), Clib 2, Circuito Liberdade 4 (3 só da listagem), Palácio das Artes 5, CCBB 0 novos, Sesc Minas 2, Cine Santa Tereza 1.
- Propostos: 18. Cadastrados: 4 novos (Inter Alia, Exposição Picasso, Cineclube Comum: Visões Táteis 5, Sessão da Meia-Noite: Super Xuxa) e 1 atualização (grade de filmes do Cine Santa Tereza). Os demais ficaram de fora por não terem a página do próprio evento aberta (preço/data só da listagem), data inconsistente ou fora da semana (Cinema e Psicanálise, Reimagine Bach, Feira Pindorama, exposições só de listagem), preço acima de R$ 30 ou perfil de festa (Concertos Minas Tênis Clube R$ 34, Mahler e nós R$ 70, Quarta Livre).
- Revisão (opus): 5 itens auditados, 4 aprovados e 1 reprovado em parte. Exposição Picasso tinha local errado ("Sesc Mezanino", que virou Sesc Palladium) e data de abertura trocada (24/10); corrigidos e o evento ficou. Ajuste opcional no Cine Santa Tereza (título do filme de 11/11) aplicado.
- Eventos antigos removidos: 0.
- Geocodificação: o local novo "Sesc Mezanino" foi descartado junto com a correção; a coordenada do Zoológico (errada, o Zoo usa a chave `zoo`) também foi descartada. Nenhuma coordenada nova ficou.
- Teste de sintaxe do JS: passou.
- Tag de backup: backup/pre-update-2026-11-09 (cópia em backups/2026-11-09/).
