const {
  spinWheel,
  checkWithdrawEligibility,
} = require("../services/spinWheel");
const User = require("../models/User");

const spinGame = async (ctx) => {
  const userId = ctx.from.id;
  const user = await User.findOne({ telegramId: userId });

  if (!user.joinedChannel) {
    return ctx.reply("Please join our channel first!");
  }

  if (user.spinsLeft > 0) {
    const spinResult = spinWheel();
    user.spinsLeft -= 1;
    user.totalEarnings += spinResult;

    // Check withdrawal eligibility
    if (checkWithdrawEligibility(user.totalEarnings)) {
      user.canWithdraw = true;
    }

    await user.save();

    await ctx.reply(
      `🎉 You won ₹${spinResult}!\n\nTotal earnings: ₹${user.totalEarnings}\nSpins left: ${user.spinsLeft}`,
      user.canWithdraw
        ? Markup.inlineKeyboard([
            Markup.button.callback("💰 Withdraw", "WITHDRAW"),
          ])
        : null
    );

    if (user.spinsLeft === 0) {
      const referralLink = `https://t.me/${ctx.botInfo.username}?start=${user.referralCode}`;
      await ctx.reply(
        `You're out of spins! Invite friends to earn ₹10 per referral!\n\nYour referral link: ${referralLink}`
      );
    }
  } else {
    await ctx.reply(
      "No spins left! Invite friends to earn ₹10 per referral and get more spins!"
    );
  }
};

module.exports = { spinGame };
