const sqlite3     =   require('sqlite3').verbose();
const { DB_PATH }  = require('../constants');

let db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

const getQueryResult = (query, arguments = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, arguments, (err, rows) => {
          if(err){
            console.error("DB Error: query failed: ", err.message);
            return reject(err.message)
          }
          return resolve(rows)
        })
    })
}

module.exports = getQueryResult;