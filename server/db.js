const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'applications.json');

function readAll() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw || '[]');
}

function writeAll(applications) {
  fs.writeFileSync(DB_PATH, JSON.stringify(applications, null, 2));
}

module.exports = { readAll, writeAll };
