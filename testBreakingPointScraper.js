const { scrapeBreakingPointStats } = require('./scraper/breakingPointStats');

(async () => {
  try {
    const data = await scrapeBreakingPointStats();
    console.log(data);
  } catch (error) {
    console.error('Error during scraping:', error);
  }
})();
