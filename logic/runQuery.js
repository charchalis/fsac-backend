const sqlite3 = require('sqlite3').verbose();
const { DB_PATH } = require('../constants');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to SQLite database.');
});

// For INSERT, UPDATE, DELETE
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        console.error("DB Error: query failed: ", err.message);
        return reject(err.message);
      }
      // `this` is the Statement object: has .lastID, .changes
      resolve({ lastID: this.lastID, changes: this.changes});
    });
  });
};

module.exports = runQuery;
