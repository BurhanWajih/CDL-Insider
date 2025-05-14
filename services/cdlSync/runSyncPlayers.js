const syncPlayers = require('./syncPlayers');

syncPlayers()
  .then(() => {
    console.log('🎯 Done syncing players');
    process.exit(0); // exits the script
  })
  .catch((err) => {
    console.error('❌ Error syncing players:', err);
    process.exit(1); // exits with error
  });
