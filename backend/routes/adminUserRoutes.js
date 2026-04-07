const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  fetchUsers,
  fetchSingleUser,
  editUser,
  removeUser,
} = require("../controllers/adminUserController");

// ================= ROUTES =================
router.get("/admin/users", verifyToken, fetchUsers);
router.get("/admin/users/:id", verifyToken, fetchSingleUser);
router.put("/admin/users/:id", verifyToken, editUser);
router.delete("/admin/users/:id", verifyToken, removeUser);

module.exports = router;
