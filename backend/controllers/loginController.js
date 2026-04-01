const { findUserByUsername } = require("../services/loginService");
const { generateToken } = require("../utils/jwt");

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

  findUserByUsername(username, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (!result.length) {
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

    // ✅ INCLUDE ROLE IN TOKEN
    const token = generateToken({
      userId: user.user_id,
      role: user.user_role,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.user_role, // ✅ IMPORTANT
    });
  });
};

module.exports = login;
