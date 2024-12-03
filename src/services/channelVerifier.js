const axios = require("axios");

const verifyUserInChannel = async (bot, channelUsername, userId) => {
  try {
    const member = await bot.telegram.getChatMember(channelUsername, userId);
    return member.status === "member" || member.status === "administrator";
  } catch (error) {
    console.error("Verification Error:", error);
    return false;
  }
};

module.exports = { verifyUserInChannel };
