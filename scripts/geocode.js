// Gera dados/coords.json com as coordenadas de cada ponto do mapa.
// Busca no Nominatim (OpenStreetMap), no máximo 1 requisição por segundo,
// como pedido no CLAUDE.md. Roda uma vez; o resultado é embutido na página.
const fs = require('fs');
const path = require('path');
const { targets } = require('./extract-targets');

const OUT = path.join(__dirname, '..', 'dados', 'coords.json');
const UA = 'saidas-bh-projeto-geocoder/1.0 (uso pessoal, geracao unica de coordenadas)';
const DELAY_MS = 1100;
// viewbox aproximado da Grande BH, só pra favorecer resultados da região (não exclui o resto)
const VIEWBOX = '-44.25,-19.70,-43.80,-20.15';

// Coordenadas já confirmadas num guia (ver CLAUDE.md), usadas direto sem buscar.
const MANUAL = {
  'pq-serra-curral': [-19.9627, -43.9188],
  'parque-mangabeiras': [-19.9513, -43.9055],
  'parque-municipal': [-19.9243, -43.9350],
  'pq-ecologico': [-19.8461, -43.9700],
  'pq-borboletas': [-19.9577, -43.9357],
  'lagoa-nado': [-19.8330, -43.9614],
  'pq-burle-marx': [-20.0001, -43.9980],
  'pq-renato-azeredo': [-19.8752, -43.9334],
  'pq-jk': [-19.9581, -43.9302],
  // Fica fora de BH (Brumadinho); a busca com ", Belo Horizonte" dava resultado errado.
  'inhotim': [-20.1347, -44.2158],
};
// Centro de BH (Praça Sete), último recurso quando nem o bairro é encontrado.
const CENTRO_BH = [-19.9208, -43.9378];

function stripArea(area) {
  return String(area || '').replace(/\([^)]*\)/g, '').split(/ e /i)[0].trim();
}

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

async function nominatim(q) {
  var url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br'
    + '&viewbox=' + VIEWBOX + '&bounded=0&q=' + encodeURIComponent(q);
  var res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'pt-BR' } });
  if (!res.ok) throw new Error('HTTP ' + res.status + ' para: ' + q);
  var j = await res.json();
  if (!j.length) return null;
  return { lat: parseFloat(j[0].lat), lon: parseFloat(j[0].lon), display: j[0].display_name };
}

async function main() {
  var coords = {};
  if (fs.existsSync(OUT)) {
    try { coords = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch (e) { coords = {}; }
  }
  var areaCache = {}; // area -> {lat,lon} ou null
  var entries = Array.from(targets.entries());
  var total = entries.length, done = 0, novos = 0, aprox = 0, falhou = 0;

  for (var idx = 0; idx < entries.length; idx++) {
    var key = entries[idx][0], info = entries[idx][1];
    done++;

    if (MANUAL[key]) {
      if (!coords[key] || coords[key].src !== 'manual') { coords[key] = { lat: MANUAL[key][0], lon: MANUAL[key][1], approx: false, src: 'manual' }; novos++; }
      continue;
    }
    if (coords[key] && coords[key].src) { continue; } // já tem, não busca de novo

    var isLocal = key.indexOf('local-') === 0;
    // "A Autêntica, Santa Efigênia" -> nome "A Autêntica", bairro "Santa Efigênia"
    var areaDoNome = isLocal && info.name.indexOf(',') >= 0 ? info.name.split(',').slice(1).join(',').trim() : '';
    var area = stripArea(info.area || areaDoNome);

    var query = isLocal
      ? info.name + ', Belo Horizonte, Brasil'
      : info.name + (info.area ? ', ' + info.area : '') + ', Belo Horizonte, Brasil';

    var r = null;
    try { r = await nominatim(query); } catch (e) { console.error('erro:', key, e.message); }
    await sleep(DELAY_MS);

    if (r) {
      coords[key] = { lat: r.lat, lon: r.lon, approx: false, src: 'nominatim' };
      novos++;
    } else if (area) {
      // cai no centro do bairro
      if (!(area in areaCache)) {
        var br = null;
        try { br = await nominatim(area + ', Belo Horizonte, Brasil'); } catch (e) { console.error('erro bairro:', area, e.message); }
        await sleep(DELAY_MS);
        areaCache[area] = br;
      }
      var b = areaCache[area];
      if (b) {
        coords[key] = { lat: b.lat, lon: b.lon, approx: true, src: 'bairro' };
        aprox++;
      } else {
        coords[key] = { lat: CENTRO_BH[0], lon: CENTRO_BH[1], approx: true, src: 'cidade' };
        aprox++;
        console.error('bairro não encontrado, caiu no centro da cidade:', key, info.name, area);
      }
    } else {
      coords[key] = { lat: CENTRO_BH[0], lon: CENTRO_BH[1], approx: true, src: 'cidade' };
      aprox++;
      console.error('sem bairro, caiu no centro da cidade:', key, info.name);
    }

    if (done % 20 === 0) {
      fs.writeFileSync(OUT, JSON.stringify(coords, null, 1));
      console.log('[' + done + '/' + total + '] salvo parcial. novos=' + novos + ' aprox=' + aprox + ' falhou=' + falhou);
    }
  }

  fs.writeFileSync(OUT, JSON.stringify(coords, null, 1));
  console.log('Pronto. total=' + total + ' novos=' + novos + ' aprox=' + aprox + ' falhou=' + falhou);
}

main().catch(function (e) { console.error(e); process.exit(1); });
