// controllers/cdlController.js
const fetchCDLStats = require("../services/cdlSync/fetchCDLstats");

exports.getCDLStats = async (req, res) => {
  try {
    const data = await fetchCDLStats();
    res.json(data);
  } catch (err) {
    console.error("Error in getCDLStats:", err.message);
    res.status(500).json({ error: "Failed to fetch CDL stats" });
  }
};
const fetchMatchPlayerStats = require("../services/cdlSync/fetchMatchPlayerStats");
const db = require("../db/mysql");

/**
 * GET /api/match/:entryUid/player-stats
 * Fetches CDL player stats for a match and saves them into MySQL.
 */
exports.getMatchPlayerStats = async (req, res) => {
  const { entryUid } = req.params;

  try {
    // 1. Fetch from CDN API
    const stats = await fetchMatchPlayerStats(entryUid);

    // 2. Insert or update each stat row in `player_stats`
    for (const s of stats) {
      const matchId   = s.matchId;    // numeric match identifier
      const playerId  = s.playerId;   // numeric player identifier
      const kills     = s.kills;
      const deaths    = s.deaths;
      const assists   = s.assists;
      const damage    = s.damageDone; // map to your `damage_done` column

      await db.query(
        `INSERT INTO player_stats 
           (match_id, player_id, kills, deaths, assists, damage_done)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           kills       = VALUES(kills),
           deaths      = VALUES(deaths),
           assists     = VALUES(assists),
           damage_done = VALUES(damage_done)`,
        [matchId, playerId, kills, deaths, assists, damage]
      );
    }

    res.json({ success: true, inserted: stats.length });
  } catch (err) {
    console.error("getMatchPlayerStats error:", err);
    res.status(500).json({ error: "Failed to fetch & save player stats" });
  }
};
