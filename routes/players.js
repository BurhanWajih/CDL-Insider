const express = require("express");
const router = express.Router();
const { getTopPlayers } = require("../controllers/playerController");

router.get("/top", getTopPlayers);

module.exports = router;
