// Embute dados/social.json dentro do index.html, substituindo a linha "var SOCIAL=...;".
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const socialPath = path.join(__dirname, '..', 'dados', 'social.json');

const social = JSON.parse(fs.readFileSync(socialPath, 'utf8'));
let html = fs.readFileSync(htmlPath, 'utf8');

const marker = 'var SOCIAL=';
const i = html.indexOf(marker);
if (i < 0) throw new Error('var SOCIAL= não encontrado em index.html');
const j = html.indexOf(';', i);
if (j < 0) throw new Error('fim de var SOCIAL= não encontrado');

const novo = marker + JSON.stringify(social);
html = html.slice(0, i) + novo + html.slice(j);
fs.writeFileSync(htmlPath, html);
console.log('SOCIAL embutido com', Object.keys(social).length, 'pontos.');
