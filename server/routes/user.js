const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const dbController = require("../controllers/dbController");
const {
  register,
  login,
  updateUser,
  getPlayerCount,
  getAdminCount,
  getOrganizerCount,
  getAllUsers,
  deleteUser,
  registerUser,
} = require("../controllers/userController");
const { authenticateJWT, authorizeAdmin } = require("../middlewares/auth");

router.post("/register", register);
router.post("/register-user", authenticateJWT, authorizeAdmin, registerUser);
router.post("/login", login);
router.get("/test-db", dbController.testConnection);
router.get("/player-count", authenticateJWT, authorizeAdmin, getPlayerCount);
router.get("/admin-count", authenticateJWT, authorizeAdmin, getAdminCount);
router.get(
  "/organizer-count",
  authenticateJWT,
  authorizeAdmin,
  getOrganizerCount
);
router.get("/all-users", authenticateJWT, authorizeAdmin, getAllUsers); // Nouvelle route pour récupérer tous les utilisateurs
router.delete("/:id", authenticateJWT, authorizeAdmin, deleteUser); // Nouvelle route pour supprimer un utilisateur

// Route pour mettre à jour un utilisateur (requiert authentification et autorisation admin)
router.patch("/:id", authenticateJWT, authorizeAdmin, updateUser);

module.exports = router;
