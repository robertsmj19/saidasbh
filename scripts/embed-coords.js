// Embute dados/coords.json dentro do index.html, substituindo a linha "var COORDS=...;".
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const coordsPath = path.join(__dirname, '..', 'dados', 'coords.json');

const coords = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));
let html = fs.readFileSync(htmlPath, 'utf8');

const marker = 'var COORDS=';
const i = html.indexOf(marker);
if (i < 0) throw new Error('var COORDS= não encontrado em index.html');
const j = html.indexOf(';', i);
if (j < 0) throw new Error('fim de var COORDS= não encontrado');

const novo = marker + JSON.stringify(coords);
html = html.slice(0, i) + novo + html.slice(j);
fs.writeFileSync(htmlPath, html);
console.log('COORDS embutido com', Object.keys(coords).length, 'pontos.');
