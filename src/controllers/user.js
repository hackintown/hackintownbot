const User = require("../models/User");
const { verifyUserInChannel } = require("../services/channelVerifier");
const crypto = require("crypto");

const startBot = async (ctx) => {
  const telegramId = ctx.from.id;
  const username = ctx.from.username;
  const referralCode = ctx.message.text.split(" ")[1];

  let user = await User.findOne({ telegramId });

  if (!user) {
    // Generate unique referral code
    const newReferralCode = crypto.randomBytes(4).toString("hex");

    user = new User({
      telegramId,
      username,
      referralCode: newReferralCode,
      referredBy: referralCode,
    });

    // Handle referral reward
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referrer.totalEarnings += 10;
        referrer.referrals += 1;
        await referrer.save();
      }
    }

    await user.save();
  }

  await ctx.reply(
    "Welcome to Spin and Win! Click the button to play.",
    Markup.inlineKeyboard([
      Markup.button.callback("🎮 Start Playing", "START_PLAYING"),
    ])
  );
};

const joinChannelUI = async (ctx) => {
  await ctx.reply(
    "Join the Telegram channel and get 3 free spins!",
    Markup.inlineKeyboard([
      Markup.button.url("Join Channel", process.env.CHANNEL_URL),
      Markup.button.callback("Continue", "VERIFY_JOIN"),
    ])
  );
};

const verifyJoin = async (ctx) => {
  const userId = ctx.from.id;
  const isMember = await verifyUserInChannel(
    bot,
    process.env.CHANNEL_USERNAME,
    userId
  );

  if (isMember) {
    const user = await User.findOne({ telegramId: userId });
    user.joinedChannel = true;
    await user.save();

    return ctx.reply(
      "You have joined the channel! Let’s play the spin game.",
      Markup.inlineKeyboard([
        Markup.button.callback("Spin the Wheel", "SPIN_WHEEL"),
      ])
    );
  }

  return ctx.reply("Please join the channel to continue!");
};

module.exports = { startBot, joinChannelUI, verifyJoin };
