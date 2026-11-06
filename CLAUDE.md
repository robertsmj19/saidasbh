# Saídas em BH

Página para ajudar o usuário a sair mais de casa em Belo Horizonte. Ele trabalha em home office, faz doutorado e tem pouco tempo livre. A página será publicada no GitHub Pages e enviada para amigos.

## Regras da semana

- Até 3 saídas por semana, com pelo menos uma grátis ou até R$ 20. Passagem de ônibus fora da conta.
- A página sugere 6 opções por semana, sempre com pelo menos uma do Duo Gourmet, uma cultural gratuita e um espaço público.
- No máximo uma sugestão por `lugar` (itens no mesmo endereço ou passeio).
- As sugestões do Duo usam só os favoritos, porque são os únicos com dias e regras conferidos.

## Arquivos

- `index.html`: a página inteira, sem dependências locais (além do Leaflet e da fonte, carregados de CDN). HTML, CSS e JS num arquivo só.
- `dados/duo_bh_lista.txt`: lista pública do Duo Gourmet em BH (slug|nome|cozinha|nota|bairro), tirada de https://www.duogourmet.com.br/restaurantes/belo-horizonte em novembro de 2026. Os 11 favoritos não estão nela, ficam no `SEED`.
- `dados/coords.json`: coordenada de cada ponto do mapa (chave `lugar` ou `id`, veja abaixo), gerada pelo script de geocodificação. Embutida em `index.html` como `COORDS`.
- `scripts/`: scripts Node usados só para gerar o mapa, não rodam no navegador.
  - `extract-targets.js`: lê o `index.html` e lista os pontos que precisam de coordenada (sem depender do DOM).
  - `geocode.js`: busca cada ponto no Nominatim (1 busca/segundo), com fallback pro centro do bairro e, por último, pro centro da cidade. É incremental: rodar de novo só busca o que ainda não tem coordenada salva em `dados/coords.json`.
  - `embed-coords.js`: substitui o `var COORDS=...;` dentro do `index.html` pelo conteúdo atual de `dados/coords.json`.
  - Fluxo pra atualizar coordenadas depois de mexer no `SEED`, `DUOCAT` ou `EVPAD`: `node scripts/geocode.js` e depois `node scripts/embed-coords.js`.

## Dados dentro do index.html

- `SEED`: lugares fixos (parques, museus, Duo favoritos, hobbies). Campos: `id, name, cat (duo|cultural|publico|evento|hobby), area, days (0=segunda a 6=domingo), cost (null = desconhecido), byDay, rule, lugar, ok (true = conferido em fonte oficial), note, link, ico, fav`.
- `EVPAD`: eventos com data (semana de 2 a 8 de novembro de 2026). Expiram e precisam de atualização semanal.
- `DUOCAT`: restaurantes do Duo gerados a partir da lista acima.
- `FSEED`: fontes da aba "Fontes da cidade". `s: 1` = link aberto e conferido, `pri: 1` = rotina de segunda.
- `COORDS`: coordenada de cada ponto do mapa, gerada por `scripts/geocode.js` a partir de `dados/coords.json` (ver seção Arquivos). Chave é `it.lugar||it.id`; para eventos, a mesma chave `lugar` que o `eventItems()` já calcula a partir do campo `local`. Cada entrada tem `approx` (true = caiu no bairro ou na cidade, mostrado como "local aproximado" no balão) e `src` (`manual`, `nominatim`, `bairro` ou `cidade`).
- Tudo que o usuário faz (dias, favoritos, preços, "Fui", fontes vistas) fica no `localStorage` do navegador.

## Decisões tomadas

- Visual: azul dos azulejos do Portinari (Igrejinha da Pampulha) com amarelo do ipê. O elemento marcante são os dias em ladrilhos; o resto é discreto. Fonte Familjen Grotesk.
- Cada cartão tem uma ação principal (Escolher). Favoritar, preço e "Fui" ficam em "Mais".
- A escolha da semana fica numa barra fixa no rodapé.
- Itens sem fonte oficial aparecem como "conferir antes". Não inventar preço, horário nem coordenada.

## Mapa (feito)

Aba "Mapa" com Leaflet e fundo do OpenStreetMap, ao lado de "Opções da semana" e "Fontes da cidade".

- Tiles vêm de `tile.openstreetmap.fr` (espelho da OpenStreetMap France), não do `tile.openstreetmap.org` oficial. O servidor oficial bloqueou os tiles (403 "not following the tile usage policy") provavelmente por causa do volume de acessos de ambientes de teste/sandbox que passam pelo mesmo IP. O CARTO (`basemaps.cartocdn.com`) também foi tentado e passou a exigir chave de API, então não serve sem cadastro. Se o `tile.openstreetmap.fr` parar de funcionar, trocar de novo em `index.html` (função `initMap`, chamada `L.tileLayer(...)`).

- Filtros: cultura e museus, parques e passeios, eventos, Duo favoritos, Duo (todos), hobbies. Todos começam marcados. "Duo favoritos" são os itens do `SEED` com `isFav`; "Duo (todos)" é o resto do `DUOCAT`.
- Cada ponto abre um balão com nome, preço (`priceTxt`) e os botões Escolher e Mapa. "Escolher" no balão tem listener próprio com `stopPropagation` (o clique dentro do popup do Leaflet não emperra no clique geral do `document`, mas sem isso o pick é desfeito na hora por causa dos dois listeners).
- Coordenadas vêm de `dados/coords.json` (ver seção Arquivos e dados), geradas pelo Nominatim a 1 busca/segundo. 9 pontos usam coordenada já conferida (ver `MANUAL` em `scripts/geocode.js`): Serra do Curral, Mangabeiras, Parque Municipal, Ecológico da Pampulha, Mata das Borboletas, Lagoa do Nado, Parque das Águas, Renato Azeredo, Parque JK, e o Inhotim (fica em Brumadinho, fora de BH).
- Pontos não encontrados exatos caem no centro do bairro; os poucos sem bairro reconhecido caem no centro da cidade (Praça Sete). Em ambos os casos o balão mostra "local aproximado". Na geração de novembro de 2026: 61 exatos, 332 aproximados (quase todo o Duo "todos", que mesmo assim não é dado conferido, ver regra do Duo acima).

## Google e Instagram nos cartões (feito, parcial)

Todo item (cartão e balão do mapa) ganhou um botão "Google" e, quando encontrado, um botão "Instagram".

- `dados/social.json`: por chave (`it.lugar||it.id`, igual `COORDS`), guarda `google` (link de busca gerado automaticamente, sempre presente) e `instagram` (URL real ou `null`). Embutido em `index.html` como `SOCIAL`.
- `scripts/build-social.js`: gera o link do Google pra todo ponto (determinístico, não precisa de busca) e preserva o `instagram` já salvo. Rodar depois de mexer no `SEED`, `DUOCAT` ou `EVPAD`.
- `scripts/embed-social.js`: substitui `var SOCIAL=...;` no `index.html` pelo conteúdo de `dados/social.json`. Fluxo: `node scripts/build-social.js && node scripts/embed-social.js`.
- O Instagram é pesquisado à parte (não tem API gratuita confiável pra isso). Duas levas de agentes em paralelo, no total 163 de 395 com Instagram confirmado (o resto só tem o botão Google).
  - 1ª leva: 10 agentes usando a ferramenta de busca da sessão, que tem cota compartilhada entre todos (200 buscas por turno). A cota estourou rápido e dividida entre 10 agentes, muitos itens nem chegaram a ser pesquisados. Resultado: 74 de 395.
  - 2ª leva: focada só nos itens que a 1ª leva nunca chegou a pesquisar (179 deles). Em vez da ferramenta de busca, os agentes usaram busca direta por HTTP (Bing, Yahoo, e DuckDuckGo quando não dava captcha) via WebFetch, sem cota compartilhada. Resultado: mais 89 de 179.
  - Padrão observado: redes e lugares conhecidos (museus, parques, restaurantes grandes) acham fácil; bares e restaurantes pequenos/pouco indexados do Duo Gourmet "todos" costumam não aparecer nos buscadores, não porque não têm Instagram, mas porque a busca não indexa bem. Rodar de novo com outra ferramenta de busca pode achar mais alguns.
- `scripts/merge-social-results.js <pasta>`: junta arquivos `result-NN.json` (formato `[{key, instagram}]`) numa leva de busca de volta pro `social.json`, sem mexer no `google`.

## Pendências

- Dias e regras dos favoritos do Duo: só Trip Food e Buteco do Rod foram conferidos na página oficial do Duo. Os outros 9 vêm das anotações do usuário. A página de cada um está no campo `link`.
- Conferir em fonte oficial: Igrejinha, Espaço do Conhecimento, Memorial Vale, Palácio da Liberdade, Parque do Palácio, MAP, museus do Circuito Liberdade, PUC, hobbies.
- Eventos da semana: atualizar `EVPAD` toda segunda a partir de Portal BH, Clib, Agenda Cultural BH e Circuito Liberdade. Local novo que não é CCBB, Palácio das Artes ou Parque Municipal entra sem coordenada no mapa até rodar `node scripts/geocode.js && node scripts/embed-coords.js`. Desenho de uma rotina automática pra isso (agentes, modelos, backup, prompt pronto) está em [ROTINA-SEMANAL.md](ROTINA-SEMANAL.md); falta só o projeto estar no GitHub e a cota de busca renovar pra ativar.
- Publicar no GitHub Pages (index.html na raiz, Settings > Pages > branch main).

## Como trabalhar aqui

- Antes de mudar o `index.html`, rode um teste de sintaxe do JS (por exemplo, extraindo o `<script>` e rodando com Node).
- Fontes e dados novos sempre com link de origem.
- Sem textos de orientação na página (nada de "comece por aqui", "não testei", explicação de como usar ou de onde vieram os dados). Notas de processo ficam no relatório da curadoria, não na interface.
- Esta é a versão completa da página (com a aba Mapa). O artefato "Saídas em BH" no claude.ai é uma versão antiga sem mapa: o claude.ai bloqueia imagens e CSS de fora, então o mapa não funciona lá.
- Respostas para o usuário: em português, conversacionais e diretas, sem travessões e sem excesso de listas.
