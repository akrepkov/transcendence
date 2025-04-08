import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';


const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const db = new Database('./database/database.sqlite');

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema);

export default db;
