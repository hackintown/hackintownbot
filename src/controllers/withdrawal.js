const User = require("../models/User");

const handleWithdrawal = async (ctx) => {
  const userId = ctx.from.id;
  const user = await User.findOne({ telegramId: userId });

  if (!user.canWithdraw) {
    return ctx.reply("You need at least ₹100 to withdraw!");
  }

  if (user.hasWithdrawn) {
    return ctx.reply("You have already withdrawn your earnings!");
  }

  // Here you would integrate your actual payment processing
  user.hasWithdrawn = true;
  await user.save();

  await ctx.reply(
    `✅ Withdrawal request for ₹${user.totalEarnings} has been processed!\n\nThank you for playing!`
  );
};

module.exports = { handleWithdrawal };
