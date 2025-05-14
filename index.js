const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// DB Connections
const connectMongo = require("./db/mongo");
connectMongo();

// Routes
const apiRoutes = require('./routes/api');         // Handles /teams and /players
const playerRoutes = require("./routes/players");  // Handles /players/top
const cdlRoutes = require("./routes/cdl");        // Handles /cdl-stats

app.use('/api', apiRoutes);
app.use('/api/players', playerRoutes); // So /api/players/top is accessible
app.use('/api', cdlRoutes);  // So /api/cdl-stats is accessible

// Start Server (only once)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
