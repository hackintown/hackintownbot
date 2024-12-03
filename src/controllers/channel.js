const User = require("../models/User");
const { verifyUserInChannel } = require("../services/channelVerifier");
const { Markup } = require("telegraf");

const joinChannelUI = async (ctx) => {
  await ctx.reply(
    "Join our Telegram channel and get 3 FREE spins!",
    Markup.inlineKeyboard([
      [Markup.button.url("Join @hackintown", "https://t.me/hackintown")],
      [Markup.button.callback("✅ I've Joined", "VERIFY_JOIN")],
    ])
  );
};

const verifyJoin = async (ctx) => {
  try {
    const userId = ctx.from.id;
    const isMember = await verifyUserInChannel(
      ctx.telegram,
      "@hackintown",
      userId
    );

    if (isMember) {
      const user = await User.findOneAndUpdate(
        { telegramId: userId },
        {
          joinedChannel: true,
          spinsLeft: 3,
        },
        { new: true, upsert: true }
      );

      await ctx.reply(
        "✅ Channel joined successfully!\nYou've received 3 FREE spins! 🎰",
        Markup.inlineKeyboard([
          Markup.button.callback("🎲 Spin Now", "SPIN_WHEEL"),
        ])
      );
    } else {
      await ctx.reply(
        "❌ Please join our channel first to continue!\n\nJoin @hackintown and try again.",
        Markup.inlineKeyboard([
          [Markup.button.url("Join Channel", "https://t.me/hackintown")],
          [Markup.button.callback("✅ Check Again", "VERIFY_JOIN")],
        ])
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    await ctx.reply("An error occurred during verification. Please try again.");
  }
};

module.exports = {
  joinChannelUI,
  verifyJoin,
};
