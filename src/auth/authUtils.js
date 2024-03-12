const JWT = require("jsonwebtoken");

// publicKey for verify token
// privateKey for sign token
const createTokenPair = async (payload, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {}
};

module.exports = { createTokenPair };
