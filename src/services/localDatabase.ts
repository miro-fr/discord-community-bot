import fs from 'fs';
import path from 'path';

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '..', 'data', 'database.json');

type DB = {
  backups: any[];
  roles: string[];
  settings: Record<string, any>;
};

const readDB = (): DB => {
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw) as DB;
  } catch (e) {
    const init: DB = { backups: [], roles: [], settings: {} };
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(init, null, 2));
    return init;
  }
};

const writeDB = (db: DB) => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

export const localDatabase = {
  getDB: (): DB => readDB(),
  addBackup: (b: any) => {
    const db = readDB();
    db.backups.push(b);
    writeDB(db);
  },
  listBackups: () => readDB().backups,
  saveSettings: (s: Record<string, any>) => {
    const db = readDB();
    db.settings = { ...db.settings, ...s };
    writeDB(db);
  },
  getSettings: () => readDB().settings,
};
