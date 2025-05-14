const fetchCDL = require('./api');
const db = require('../../db/mysql');

async function syncPlayers() {
  const data = await fetchCDL('/players');
  if (!data) return console.log('No player data fetched.');

  for (const player of data) {
    const { name, role, country, team } = player;

    // 1. Insert team (if it doesn’t exist)
    let [teamRows] = await db.query(
      `SELECT id FROM teams WHERE name = ?`,
      [team]
    );

    let teamId;

    if (teamRows.length === 0) {
      const [insertResult] = await db.query(
        `INSERT INTO teams (name) VALUES (?)`,
        [team]
      );
      teamId = insertResult.insertId;
    } else {
      teamId = teamRows[0].id;
    }

    // 2. Insert player (avoid duplicates by name)
    const [existingPlayer] = await db.query(
      `SELECT id FROM players WHERE name = ?`,
      [name]
    );

    if (existingPlayer.length === 0) {
      await db.query(
        `INSERT INTO players (name, role, country, team_id)
         VALUES (?, ?, ?, ?)`,
        [name, role, country, teamId]
      );
    } else {
      // optional: update player info
      await db.query(
        `UPDATE players SET role = ?, country = ?, team_id = ? WHERE name = ?`,
        [role, country, teamId, name]
      );
    }
  }

  console.log(`✅ Synced ${data.length} players.`);
}

module.exports = syncPlayers;
