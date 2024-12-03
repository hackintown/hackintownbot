const express = require("express");
const path = require("path");
const bot = require("./bot");

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "../public")));

// Bot webhook callback
app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));

// Set webhook
bot.telegram.setWebhook(
  `${process.env.WEBHOOK_URL}/bot${process.env.BOT_TOKEN}`
);

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
