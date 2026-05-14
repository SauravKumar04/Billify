const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createClient,
  getClients,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");

const router = express.Router();

router.use(authMiddleware);
router.post("/", createClient);
router.get("/", getClients);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
