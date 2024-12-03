const User = require("../models/User");

const trackReferral = async (referrerId, newUser) => {
  const referrer = await User.findOne({ telegramId: referrerId });
  if (referrer) {
    referrer.referrals += 1;
    referrer.totalEarnings += 10; // ₹10 for each referral
    await referrer.save();
  }
  newUser.save();
};

const handleReferral = async (ctx) => {
  const referralId = ctx.message.text.split(" ")[1];
  const telegramId = ctx.from.id;

  let user = await User.findOne({ telegramId });
  if (!user) {
    user = new User({ telegramId, username: ctx.from.username });
    if (referralId) await trackReferral(referralId, user);
  }

  await ctx.reply("Welcome! Let’s start playing.");
};

module.exports = { handleReferral };
