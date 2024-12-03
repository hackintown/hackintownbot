const express = require("express");
const bot = require("./bot");

const app = express();
app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));

bot.telegram.setWebhook(
  `${process.env.WEBHOOK_URL}/bot${process.env.BOT_TOKEN}`
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
