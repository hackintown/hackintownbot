const { Telegraf, Markup } = require("telegraf");
const connectDB = require("./utils/database");
const { startBot, joinChannelUI, verifyJoin } = require("./controllers/user");
const { spinGame } = require("./controllers/game");

require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
connectDB();

bot.start(startBot);
bot.action("START_PLAYING", joinChannelUI);
bot.action("VERIFY_JOIN", verifyJoin);
bot.action("SPIN_WHEEL", spinGame);

module.exports = bot;
