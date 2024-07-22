const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const dbController = require("../controllers/dbController");
const {
  register,
  createUser,
  login,
  updateUser,
  getPlayerCount,
  getAdminCount,
  getOrganizerCount,
  getAllUsers,
  deleteUser,
  getPlayerGenderCounts,
  getOldestPlayer,
  getYoungestPlayer,
  getPlayersByAgeRange,
  getLastFiveUsers,
  getUsersByRole,
  sendResetPasswordEmail,
  resetPassword,
} = require("../controllers/userController");
const { authenticateJWT, authorizeAdmin } = require("../middlewares/auth");

router.post("/register", register);
router.post("/create-user", authenticateJWT, authorizeAdmin, createUser);

router.post("/forgot-password", sendResetPasswordEmail);
router.post("/reset-password", resetPassword);

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
router.get(
  "/player-gender-count",
  authenticateJWT,
  authorizeAdmin,
  getPlayerGenderCounts
);

// Route pour récupérer le joueur le plus jeune
router.get(
  "/youngest-player",
  authenticateJWT,
  authorizeAdmin,
  getYoungestPlayer
);

// Route pour récupérer le joueur le plus âgé
router.get("/oldest-player", authenticateJWT, authorizeAdmin, getOldestPlayer);

router.get(
  "/players-by-age-range",
  authenticateJWT,
  authorizeAdmin,
  getPlayersByAgeRange
);

router.get(
  "/last-five-users",
  authenticateJWT,
  authorizeAdmin,
  getLastFiveUsers
);

router.get("/by-role/:role", authenticateJWT, authorizeAdmin, getUsersByRole);

router.delete("/:id", authenticateJWT, authorizeAdmin, deleteUser); // Nouvelle route pour supprimer un utilisateur

// Route pour mettre à jour un utilisateur (requiert authentification et autorisation admin)
router.patch("/:id", authenticateJWT, authorizeAdmin, updateUser);

router.put("/:id", userController.updateUser);

module.exports = router;
