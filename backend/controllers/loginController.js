const db = require("../config/db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "roadwatch_jwt_secret_key";

const login = (req, res) => {
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Please fill in all fields.",
    });
  }

  username = username.trim();
  password = password.trim();

  if (!username || !password) {
    return res.status(400).json({
      message: "Please fill in all fields.",
    });
  }

  db.query(
    "SELECT * FROM user WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.log("Login database error:", err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (result.length === 0) {
        return res.status(400).json({
          message: "Invalid username or password",
        });
      }

      const user = result[0];

      if (user.password !== password) {
        return res.status(400).json({
          message: "Invalid username or password",
        });
      }

      const token = jwt.sign(
        {
          userId: user.user_id,
        },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      return res.status(200).json({
        message: "Login successful",
        token,
      });
    },
  );
};

module.exports = login;
