// scraper/breakingPointStats.js
const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeBreakingPointStats() {
  const browser = await puppeteer.launch({
    headless: true,            // ensures no UI
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  await page.goto('https://www.breakingpoint.gg/stats/advanced', {
    waitUntil: 'domcontentloaded',
  });

  // Wait for the table to actually load
  await page.waitForFunction(
    () => document.querySelector('table')?.innerText.includes('Slayer Rating'),
    { timeout: 15000 }
  );

  // (Optional) dump HTML for debugging
  // fs.writeFileSync('page_dump.html', await page.content());

  const stats = await page.evaluate(() => {
    const rows = document.querySelectorAll('table tbody tr');
    const data = [];
    rows.forEach(row => {
      const c = row.querySelectorAll('td');
      if (c.length >= 29) data.push({
        playerRank:             c[0].innerText.trim(),
        playerName:             c[1].innerText.trim(),
        kd:                     parseFloat(c[2].innerText),
        overallRating:          parseFloat(c[3].innerText),
        slayerRating:           parseFloat(c[4].innerText),
        trueEngagementSuccess:  parseFloat(c[5].innerText),
        hpKd:                   parseFloat(c[6].innerText),
        hpKillsPer10Min:        parseFloat(c[7].innerText),
        hpDamagePer10Min:       parseFloat(c[8].innerText.replace(/,/g, '')),
        hpObjPer10Min:          parseFloat(c[9].innerText),
        hpEngagementsPer10Min:  parseFloat(c[10].innerText),
        hpMapsPlayed:           parseInt(c[11].innerText),
        sndKd:                  parseFloat(c[12].innerText),
        sndKillsPerRound:       parseFloat(c[13].innerText),
        firstBloods:            parseInt(c[14].innerText),
        firstDeaths:            parseInt(c[15].innerText),
        opdWinPercentage:       parseFloat(c[16].innerText.replace('%','')),
        plants:                 parseInt(c[17].innerText),
        defuses:                parseInt(c[18].innerText),
        sndMaps:                parseInt(c[19].innerText),
        ctlKd:                  parseFloat(c[20].innerText),
        ctlKillsPer10Min:       parseFloat(c[21].innerText),
        ctlDamagePer10Min:      parseFloat(c[22].innerText.replace(/,/g, '')),
        ctlEngagementsPer10Min: parseFloat(c[23].innerText),
        zoneTierCaptures:       parseInt(c[24].innerText),
        ctlMaps:                parseInt(c[25].innerText),
        gameTimeMinutes:        parseFloat(c[26].innerText),
        nonTradedKills:         parseInt(c[27].innerText),
        ctlMapsPlayed:          parseInt(c[28].innerText)
      });
    });
    return data;
  });

  await browser.close();
  return stats;
}

module.exports = { scrapeBreakingPointStats };
