const { Telegraf, Markup } = require("telegraf");
const connectDB = require("./utils/database");
const { startBot } = require("./controllers/user");
const { handleSpinGame } = require("./controllers/game");
const { handleWithdrawal } = require("./controllers/withdrawal");
const { verifyJoin, joinChannelUI } = require("./controllers/channel");

require("dotenv").config();

if (!process.env.BOT_TOKEN) {
  console.error("BOT_TOKEN is missing!");
  process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// Connect to MongoDB
connectDB().catch(console.error);

// Command handlers
bot.command("start", async (ctx) => {
  console.log("Start command received");
  await ctx.reply(
    "Welcome to Spin and Win! Click the button to play",
    Markup.inlineKeyboard([
      Markup.button.callback(" Start Playing", "START_PLAYING"),
    ])
  );
});

// Action handlers
bot.action("START_PLAYING", joinChannelUI);
bot.action("VERIFY_JOIN", verifyJoin);
bot.action("SPIN_WHEEL", handleSpinGame);
bot.action("WITHDRAW", handleWithdrawal);

// Error handler
bot.catch((err, ctx) => {
  console.error("Bot error:", err);
  ctx.reply("An error occurred! Please try again.");
});

// Launch bot
bot
  .launch()
  .then(() => {
    console.log("Bot started successfully!");
    console.log("Bot username:", bot.botInfo?.username);
  })
  .catch((err) => {
    console.error("Failed to start bot:", err);
  });

module.exports = bot;
