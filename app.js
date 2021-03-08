const express = require('express'),
      app = express(),
      webhooks = require('./routes/webhooks'),
      logger = require('./services/logger-service');

// Loads environment variable values
require('dotenv').config();

app.use(express.json()) //Json body parser

app.use('/api', webhooks)
// Default route only sends a 404 
app.use(function (req, res) {
    res.sendStatus(404);
});

const PORT = process.env.PORT || 9876;

app.listen(PORT, () => {
    logger.info(`Listening on port: ${PORT}`);
    console.log(`Listening on port: ${PORT}`);
})

module.exports = app;