const db = require("../db/mysql");

exports.getTopPlayers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM players ORDER BY kdr DESC LIMIT 10");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
