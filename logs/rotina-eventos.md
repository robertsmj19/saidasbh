
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
