// sqlite-adapter.js
// Basic SQLite helper for Capacitor (example usage)
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';

const sqlite = CapacitorSQLite;

export async function initDB() {
  try {
    const conn = await sqlite.createConnection({ database: 'skylend.db', version: 1, encryption: false });
    await conn.open();
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        address TEXT,
        phone TEXT,
        balance REAL,
        updated_at TEXT
      );
    `);
    return conn;
  } catch (e) {
    console.error('SQLite init error', e);
    throw e;
  }
}
