const fs = require('fs');
const path = require('path');
const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const match = html.match(/const PROFILES = (.*);\s*\n/);
if (!match) throw new Error('No se encontró el ranking actual en index.html');
const players = JSON.parse(match[1]);
if (!players.length || players.some((p, i) => !p.nick || p.rank !== i + 1) || new Set(players.map(p => p.nick)).size !== players.length) {
  throw new Error('El ranking actual no es válido; no se guardaron posiciones');
}
const positions = Object.fromEntries(players.map(p => [p.nick, p.rank]));
fs.writeFileSync(path.join(root, 'posiciones-anteriores.json'), JSON.stringify(positions, null, 2) + '\n');
console.log(`Guardadas las posiciones actuales de ${players.length} jugadores como referencia de la próxima actualización.`);
