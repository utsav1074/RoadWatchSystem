const db = require("../config/db");

const register = (req, res) => {
  let { fullName, username, email, phone, password } = req.body;

  if (!fullName || !username || !email || !phone || !password) {
    return res.status(400).json({
      message: "Please fill in all required fields.",
    });
  }

  fullName = fullName.trim();
  username = username.trim();
  email = email.trim();
  phone = phone.trim();
  password = password.trim();

  if (!fullName || !username || !email || !phone || !password) {
    return res.status(400).json({
      message: "Please fill in all required fields.",
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      message: "Please enter a valid email address.",
    });
  }

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      message: "Enter a valid 10 digit phone number using numbers only.",
    });
  }

  if (password.length < 4) {
    return res.status(400).json({
      message: "Password must be at least 4 characters.",
    });
  }

  db.query(
    "SELECT * FROM user WHERE username = ?",
    [username],
    (err, userResult) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (userResult.length > 0) {
        return res.status(400).json({
          message: "Username already exists",
        });
      }

      db.query(
        "SELECT * FROM user WHERE email = ?",
        [email],
        (err, emailResult) => {
          if (err) {
            return res.status(500).json({
              message: "Database error",
            });
          }

          if (emailResult.length > 0) {
            return res.status(400).json({
              message: "Email already exists",
            });
          }

          const insertQuery = `
            INSERT INTO user
            (user_role, username, full_name, email, contact, password)
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          db.query(
            insertQuery,
            ["user", username, fullName, email, phone, password],
            (err, result) => {
              if (err) {
                return res.status(500).json({
                  message: "Insert failed",
                });
              }

              return res.status(201).json({
                message: "Registration successful",
                user: {
                  userId: result.insertId,
                  username,
                  fullName,
                  email,
                  role: "user",
                },
              });
            },
          );
        },
      );
    },
  );
};

module.exports = register;
