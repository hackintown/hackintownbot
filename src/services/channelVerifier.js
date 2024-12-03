const axios = require("axios");

const verifyUserInChannel = async (telegram, channelUsername, userId) => {
  try {
    const member = await telegram.getChatMember(channelUsername, userId);
    return ["member", "administrator", "creator"].includes(member.status);
  } catch (error) {
    console.error("Verification Error:", error);
    return false;
  }
};

module.exports = { verifyUserInChannel };
