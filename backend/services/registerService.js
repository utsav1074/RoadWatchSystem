const db = require("../config/db");

const findUserByUsername = (username, callback) => {
  db.query("SELECT * FROM user WHERE username = ?", [username], callback);
};

const findUserByEmail = (email, callback) => {
  db.query("SELECT * FROM user WHERE email = ?", [email], callback);
};

const createUser = (data, callback) => {
  const query = `
    INSERT INTO user
    (user_role, username, full_name, email, contact, password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      "user",
      data.username,
      data.fullName,
      data.email,
      data.phone,
      data.password,
    ],
    callback,
  );
};

module.exports = {
  findUserByUsername,
  findUserByEmail,
  createUser,
};
