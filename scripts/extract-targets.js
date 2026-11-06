// Extrai de index.html os pontos que precisam de coordenada para o mapa.
// Não executa o script da página inteira (que depende de DOM); só pega os
// trechos dos arrays de dados (SEED, DUOCAT, DUOUSADOS, EVPAD) com eval,
// porque são literais de objeto/array confiáveis (vêm do nosso próprio arquivo).
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

function grab(startMarker, endMarker) {
  const i = html.indexOf(startMarker);
  if (i < 0) throw new Error('marcador inicial não encontrado: ' + startMarker);
  const j = html.indexOf(endMarker, i + startMarker.length);
  if (j < 0) throw new Error('marcador final não encontrado: ' + endMarker);
  let seg = html.slice(i + startMarker.length, j).trim();
  if (seg.endsWith(';')) seg = seg.slice(0, -1);
  return seg;
}

var ALL = [0, 1, 2, 3, 4, 5, 6];
var T2S = [1, 2, 3, 4, 5, 6];
var DUO = 'Conferir no app se segue parceiro e a oferta vigente.';
const SEED = eval(grab('var SEED=', '\nvar ICO='));
const DUOCAT = eval(grab('var DUOCAT=', '\nvar DUOUSADOS='));
const DUOUSADOS = eval(grab('var DUOUSADOS=', '\nvar duoAll='));
const EVPAD = eval(grab('var EVPAD=', '\nfunction ymd'));

function eventLugar(local) {
  const lk = String(local || '').toLowerCase();
  if (lk.indexOf('ccbb') >= 0) return 'praca-liberdade';
  if (lk.indexOf('palácio das artes') >= 0) return 'palacio-artes';
  if (lk.indexOf('parque municipal') >= 0) return 'parque-municipal';
  if (lk) return 'local-' + lk;
  return null;
}

// key -> {name, area}
const targets = new Map();

SEED.forEach(function (it) {
  var key = it.lugar || it.id;
  if (!targets.has(key)) targets.set(key, { name: it.name, area: it.area || '' });
});

DUOCAT.forEach(function (r) {
  if (DUOUSADOS.indexOf(r[0]) >= 0) return; // já está no SEED como favorito
  var key = 'dg-' + r[0];
  targets.set(key, { name: r[1], area: r[4] || '' });
});

var seenLocal = {};
EVPAD.forEach(function (e) {
  var local = e.local || '';
  if (seenLocal[local] !== undefined) return;
  seenLocal[local] = 1;
  var lug = eventLugar(local);
  if (lug && !targets.has(lug)) targets.set(lug, { name: local, area: '' });
});

module.exports = { targets: targets, SEED: SEED, DUOCAT: DUOCAT, DUOUSADOS: DUOUSADOS, EVPAD: EVPAD };

if (require.main === module) {
  console.log('Total de pontos a geocodificar:', targets.size);
  var byType = { lugar: 0, duo: 0, local: 0, outro: 0 };
  Array.from(targets.keys()).forEach(function (k) {
    if (k.indexOf('dg-') === 0) byType.duo++;
    else if (k.indexOf('local-') === 0) byType.local++;
    else byType.outro++;
  });
  console.log(byType);
}
