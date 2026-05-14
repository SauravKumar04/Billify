const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { emailInvoice } = require("../controllers/emailController");

const router = express.Router();

router.post("/:id", authMiddleware, emailInvoice);

module.exports = router;
