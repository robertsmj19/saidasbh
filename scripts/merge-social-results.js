// Junta os result-NN.json dos agentes de busca de Instagram em dados/social.json.
// Não mexe no campo "google" (isso é o build-social.js que cuida). Só atualiza
// "instagram" e marca "checked" nas chaves que vieram num dos lotes.
const fs = require('fs');
const path = require('path');

const CHUNKS_DIR = process.argv[2];
if (!CHUNKS_DIR) { console.error('uso: node merge-social-results.js <pasta-dos-chunks>'); process.exit(1); }

const OUT = path.join(__dirname, '..', 'dados', 'social.json');
const social = JSON.parse(fs.readFileSync(OUT, 'utf8'));

var files = fs.readdirSync(CHUNKS_DIR).filter(function (f) { return /^result-\d+\.json$/.test(f); });
var totalAchado = 0, totalNulo = 0, totalIgnorado = 0;

files.forEach(function (f) {
  var arr;
  try { arr = JSON.parse(fs.readFileSync(path.join(CHUNKS_DIR, f), 'utf8')); }
  catch (e) { console.error('falhou ao ler', f, e.message); return; }
  if (!Array.isArray(arr)) { console.error('formato inesperado em', f); return; }
  arr.forEach(function (item) {
    if (!item || !item.key) return;
    if (!social[item.key]) { totalIgnorado++; return; }
    social[item.key].instagram = item.instagram || null;
    social[item.key].checked = true;
    if (item.instagram) totalAchado++; else totalNulo++;
  });
});

fs.writeFileSync(OUT, JSON.stringify(social, null, 1));
console.log('lotes lidos:', files.length);
console.log('instagram achado:', totalAchado, '| não achado:', totalNulo, '| chave desconhecida:', totalIgnorado);
