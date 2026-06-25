const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'applications.json');

function readAll() {
  if (!fs.existsSync(DB_PATH)) return [];
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw || '[]');
}

function writeAll(applications) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(applications, null, 2));
}

module.exports = { readAll, writeAll };
