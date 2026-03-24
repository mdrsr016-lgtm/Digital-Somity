import fs from 'fs';
import path from 'path';

const version = new Date().getTime().toString();
const publicDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(
  path.join(publicDir, 'version.json'),
  JSON.stringify({ version: version })
);

console.log(`Generated build version: ${version}`);
