// routes/cdl.js
const express = require("express");
const router = express.Router();
const { getCDLStats, getMatchPlayerStats } = require("../controllers/cdlController");

// GET /api/cdl-stats
router.get("/cdl-stats", getCDLStats);

// GET /api/match/:entryUid/player-stats
router.get("/match/:entryUid/player-stats", getMatchPlayerStats);

module.exports = router;
