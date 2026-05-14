const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  register,
  login,
  getProfile,
  updateProfile,
  uploadProfileLogo,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/profile/logo", authMiddleware, upload.single("logo"), uploadProfileLogo);

module.exports = router;
