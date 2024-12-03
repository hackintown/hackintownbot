const { spinWheel } = require("../services/spinWheel");
const User = require("../models/User");

const spinGame = async (ctx) => {
  const userId = ctx.from.id;
  const user = await User.findOne({ telegramId: userId });

  if (user.spinsLeft > 0) {
    const spinResult = spinWheel();
    user.spinsLeft -= 1;
    user.totalEarnings += spinResult;
    await user.save();

    await ctx.reply(`🎉 You won ₹${spinResult}! Spins left: ${user.spinsLeft}`);
    if (user.spinsLeft === 0) {
      await ctx.reply("You are out of spins! Invite friends for more spins.");
    }
  } else {
    await ctx.reply("No spins left. Invite friends to earn spins!");
  }
};

module.exports = { spinGame };
