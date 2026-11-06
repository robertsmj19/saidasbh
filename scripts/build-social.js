// Gera/atualiza dados/social.json com o link de busca do Google (sempre, automático)
// para todo ponto do mapa. O campo "instagram" começa null e é preenchido à parte
// (pesquisa manual/por agente), este script nunca apaga um instagram já salvo.
const fs = require('fs');
const path = require('path');
const { targets } = require('./extract-targets');

const OUT = path.join(__dirname, '..', 'dados', 'social.json');

function googleUrl(name, area) {
  var q = name + (area ? ' ' + area : '') + ' Belo Horizonte';
  return 'https://www.google.com/search?q=' + encodeURIComponent(q);
}

var social = {};
if (fs.existsSync(OUT)) {
  try { social = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch (e) { social = {}; }
}

targets.forEach(function (info, key) {
  var prev = social[key] || {};
  social[key] = {
    google: googleUrl(info.name, info.area),
    instagram: prev.instagram || null,
    checked: prev.checked || false
  };
});

fs.writeFileSync(OUT, JSON.stringify(social, null, 1));
console.log('social.json atualizado com', Object.keys(social).length, 'pontos.');
