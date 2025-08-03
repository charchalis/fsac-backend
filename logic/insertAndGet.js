const runQuery = require('./runQuery');

const sqlite3 = require('sqlite3').verbose();
const { DB_PATH } = require('../constants');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to SQLite database.');
});

const insertAndGet = async (query, params = [], table) => {
  try {
    const result = await runQuery(query, params);
    const insertedRow = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM ? WHERE id = ?", [table, result.lastID], (err, row) => {
        if (err) return reject(err.message);
        resolve(row);
      });
    });

    return insertedRow;
  } catch (err) {
    throw new Error("Insert and fetch failed: " + err);
  }
};

module.exports = insertAndGet;