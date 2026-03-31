const db = require("../config/db");

const findUserByUsername = (username, callback) => {
  db.query("SELECT * FROM user WHERE username = ?", [username], callback);
};

module.exports = {
  findUserByUsername,
};
