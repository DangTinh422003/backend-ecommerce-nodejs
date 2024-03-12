const keyTokenMode = require("../models/keyToken.model");

class KeyTokenService {
  static async createToken({ userId, publicKey }) {
    try {
      const publicKeySring = publicKey.toString();
      const token = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeySring,
      });

      return token ? publicKeyString : null;
    } catch (error) {
      return error;
    }
  }
}

module.exports = KeyTokenService;
