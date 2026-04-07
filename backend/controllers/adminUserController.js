const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../services/adminUserService");

// ================= FETCH USERS =================
const fetchUsers = (req, res) => {
  const { search = "" } = req.query;

  getAllUsers(search, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    return res.status(200).json(results);
  });
};

// ================= GET SINGLE =================
const fetchSingleUser = (req, res) => {
  const { id } = req.params;

  getUserById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    return res.status(200).json(results[0]);
  });
};

// ================= UPDATE =================
const editUser = (req, res) => {
  const { id } = req.params;
  const { name, username, email, phone } = req.body;

  // ================= EMPTY VALIDATION =================
  if (!name?.trim() || !username?.trim() || !email?.trim() || !phone?.trim()) {
    return res.status(400).json({
      message: "Please fill in all fields.",
    });
  }

  updateUser(
    id,
    {
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
    },
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Update failed" });
      }

      return res.status(200).json({
        message: "User updated successfully",
      });
    },
  );
};

// ================= DELETE =================
const removeUser = (req, res) => {
  const { id } = req.params;

  deleteUser(id, (err) => {
    if (err) {
      return res.status(500).json({ message: "Delete failed" });
    }

    return res.status(200).json({
      message: "User deleted successfully",
    });
  });
};

module.exports = {
  fetchUsers,
  fetchSingleUser,
  editUser,
  removeUser,
};
