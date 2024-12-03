const User = require("../models/User");
const { spinWheel } = require("../services/spinWheel");
const { Markup } = require("telegraf");

const handleSpinGame = async (ctx) => {
  try {
    const userId = ctx.from.id;
    const user = await User.findOne({ telegramId: userId });

    if (!user || !user.joinedChannel) {
      return ctx.reply(
        "Please join our channel first!",
        Markup.inlineKeyboard([
          Markup.button.url("Join Channel", "https://t.me/hackintown"),
        ])
      );
    }

    if (user.spinsLeft <= 0) {
      const referralLink = `https://t.me/HackintownBot?start=${user.telegramId}`;
      return ctx.reply(
        `No spins left! 😔\n\n💰 Invite friends to earn ₹10 per referral!\n\nYour referral link:\n${referralLink}`
      );
    }

    const winAmount = spinWheel();
    user.spinsLeft -= 1;
    user.totalEarnings += winAmount;
    await user.save();

    let message = `🎉 You won ₹${winAmount}!\n\n`;
    message += `💰 Total earnings: ₹${user.totalEarnings}\n`;
    message += `🎲 Spins left: ${user.spinsLeft}`;

    const buttons = [];
    if (user.totalEarnings >= 100) {
      buttons.push([Markup.button.callback("💸 Withdraw ₹100", "WITHDRAW")]);
    }
    if (user.spinsLeft > 0) {
      buttons.push([Markup.button.callback("🎲 Spin Again", "SPIN_WHEEL")]);
    }

    await ctx.reply(
      message,
      buttons.length > 0 ? Markup.inlineKeyboard(buttons) : null
    );

    if (user.spinsLeft === 0) {
      const referralLink = `https://t.me/HackintownBot?start=${user.telegramId}`;
      await ctx.reply(
        `🎮 Game Over!\n\n💰 Invite friends to earn ₹10 per referral!\n\nYour referral link:\n${referralLink}`
      );
    }
  } catch (error) {
    console.error("Spin game error:", error);
    await ctx.reply("An error occurred during the game. Please try again.");
  }
};

module.exports = { handleSpinGame };
