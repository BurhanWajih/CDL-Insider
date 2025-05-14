// services/cdlSync/syncBreakingPoint.js

const playerTeams = require("../../teams.json");
const db = require("../../db/mysql");              // mysql2/promise pool
const { scrapeBreakingPointStats } = require("../../scraper/breakingPointStats");

async function syncBreakingPoint() {
  // 1️⃣ Scrape the data
  const stats = await scrapeBreakingPointStats();

  // 2️⃣ Ensure the season exists (or create it)
  const desiredSeasonId = 1;
  let [[seasonRow]] = await db.query(
    "SELECT id FROM season WHERE id = ?",
    [desiredSeasonId]
  );
  if (!seasonRow) {
    const [res] = await db.query(
      "INSERT INTO season (year, title) VALUES (?, ?)",
      [2025, "Call of Duty League 2025"]
    );
    seasonRow = { id: res.insertId };
    console.log("Created season with id", seasonRow.id);
  }
  const seasonId = seasonRow.id;

  // 3️⃣ Loop through each scraped player stat
  for (const p of stats) {
    // ─── Resolve team name (fallback to "Free Agent") ───
    const resolvedTeamName = playerTeams[p.playerName] || "Free Agent";

    // ─── Find team ID in `team` ───
    let [[teamRow]] = await db.query(
      "SELECT id FROM team WHERE teamName = ?",
      [resolvedTeamName]
    );
    if (!teamRow) {
      throw new Error(
        `Team "${resolvedTeamName}" for player "${p.playerName}" not found in 'team' table`
      );
    }
    console.log(
      `Player "${p.playerName}" → team "${resolvedTeamName}" (id=${teamRow.id})`
    );
    const teamId = teamRow.id;

    // ─── Upsert the player ───
    let [[playerRow]] = await db.query(
      "SELECT id FROM players WHERE name = ?",
      [p.playerName]
    );
    if (!playerRow) {
      const [r] = await db.query(
        `INSERT INTO players (name, team_id, role, country)
         VALUES (?, ?, NULL, NULL)`,
        [p.playerName, teamId]
      );
      playerRow = { id: r.insertId };
      console.log(`  Inserted player "${p.playerName}" as id=${r.insertId}`);
    }
    const playerId = playerRow.id;

    // ─── Parse rank into integer ───
    const rankInt = parseInt(p.playerRank.replace(/\D/g, ""), 10);

    // ─── Upsert into player_season_stats ───
    await db.query(
      `INSERT INTO player_season_stats
         (player_id, season_id, Player_Rank, kd, overall_rating, slayer_rating,
          true_engagement_success, game_time_minutes, non_traded_kills)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         Player_Rank             = VALUES(Player_Rank),
         kd                      = VALUES(kd),
         overall_rating          = VALUES(overall_rating),
         slayer_rating           = VALUES(slayer_rating),
         true_engagement_success = VALUES(true_engagement_success),
         game_time_minutes       = VALUES(game_time_minutes),
         non_traded_kills        = VALUES(non_traded_kills)
      `,
      [
        playerId,
        seasonId,
        rankInt,
        p.kd,
        p.overallRating,
        p.slayerRating,
        p.trueEngagementSuccess,
        p.gameTimeMinutes,
        p.nonTradedKills
      ]
    );
    console.log(`  Upserted season stats for player_id=${playerId}`);

    // ─── Fetch the bp_seasonal_id ───
    const [[bpRow]] = await db.query(
      "SELECT id FROM player_season_stats WHERE player_id = ? AND season_id = ?",
      [playerId, seasonId]
    );
    const bpSeasonalId = bpRow.id;

    // ─── Prepare and upsert the three mode rows ───
    const modes = [
      {
        mode: "HP",
        kd: p.hpKd,
        kills_per_10_min: p.hpKillsPer10Min,
        damage_per_10_min: p.hpDamagePer10Min,
        engagements_per_10_min: p.hpEngagementsPer10Min,
        maps_played: p.hpMapsPlayed,
        obj_per_10_min: p.hpObjPer10Min,
      },
      {
        mode: "SND",
        kd: p.sndKd,
        kills_per_10_min: p.sndKillsPerRound,
        damage_per_10_min: null,
        engagements_per_10_min: null,
        maps_played: p.sndMaps,
        obj_per_10_min: null,
        kills_per_round: p.sndKillsPerRound,
        first_bloods: p.firstBloods,
        first_deaths: p.firstDeaths,
        opd_win_percentage: p.opdWinPercentage,
        plants: p.plants,
        defuses: p.defuses
      },
      {
        mode: "CTL",
        kd: p.ctlKd,
        kills_per_10_min: p.ctlKillsPer10Min,
        damage_per_10_min: p.ctlDamagePer10Min,
        engagements_per_10_min: p.ctlEngagementsPer10Min,
        maps_played: p.ctlMapsPlayed,
        zone_tier_captures: p.zoneTierCaptures
      }
    ];

    for (const m of modes) {
      await db.query(
        `INSERT INTO bp_mode_stats (
           bp_seasonal_id, mode, kd, kills_per_10_min, damage_per_10_min,
           engagements_per_10_min, maps_played, obj_per_10_min,
           zone_tier_captures, kills_per_round, first_bloods,
           first_deaths, opd_win_percentage, plants, defuses
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           kd                     = VALUES(kd),
           kills_per_10_min       = VALUES(kills_per_10_min),
           damage_per_10_min      = VALUES(damage_per_10_min),
           engagements_per_10_min = VALUES(engagements_per_10_min),
           maps_played            = VALUES(maps_played),
           obj_per_10_min         = VALUES(obj_per_10_min),
           zone_tier_captures     = VALUES(zone_tier_captures),
           kills_per_round        = VALUES(kills_per_round),
           first_bloods           = VALUES(first_bloods),
           first_deaths           = VALUES(first_deaths),
           opd_win_percentage     = VALUES(opd_win_percentage),
           plants                 = VALUES(plants),
           defuses                = VALUES(defuses)
        `,
        [
          bpSeasonalId, m.mode, m.kd, m.kills_per_10_min, m.damage_per_10_min,
          m.engagements_per_10_min, m.maps_played, m.obj_per_10_min,
          m.zone_tier_captures||null, m.kills_per_round||null, m.first_bloods||null,
          m.first_deaths||null, m.opd_win_percentage||null, m.plants||null, m.defuses||null
        ]
      );
      console.log(`    Upserted ${m.mode} stats for bp_seasonal_id=${bpSeasonalId}`);
    }
  }

  console.log("✅ BreakingPoint stats synced successfully.");
  process.exit(0);
}

syncBreakingPoint().catch(err => {
  console.error("Sync error:", err);
  process.exit(1);
});
