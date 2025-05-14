const express = require('express');
const router = express.Router();
const db = require('../db/mysql'); 

// GET /api/teams
router.get('/teams', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM teams");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/players
router.get('/players', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT players.id, players.name, players.role, players.country, teams.name AS team_name
      FROM players
      JOIN teams ON players.team_id = teams.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET /api/match/:id/stats
router.get('/match/:id/stats', async (req, res) => {
  const matchId = req.params.id;
  try {
    const [rows] = await db.query(`
      SELECT ps.player_id, p.name, ps.kills, ps.deaths, ps.assists, ps.damage_done
      FROM player_stats ps
      JOIN players p ON ps.player_id = p.id
      WHERE ps.match_id = ?
    `, [matchId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/player/:id/weapons
router.get('/player/:id/weapons', async (req, res) => {
  const playerId = req.params.id;
  try {
    const [rows] = await db.query(`
      SELECT w.name AS weapon_name, pw.kills, pw.accuracy
      FROM player_weapons pw
      JOIN weapons w ON pw.weapon_id = w.id
      WHERE pw.player_id = ?
    `, [playerId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
