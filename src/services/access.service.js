const bcript = require("bcrypt");
const shopModel = require("../models/shop.model");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { type } = require("os");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static async signUp({ name, email, password }) {
    try {
      // 1. check email exists?
      const hoderShop = await shopModel.findOne({ email }).lean();
      if (hoderShop) {
        return {
          code: "xxxx",
          message: "Shop already registered!",
        };
      }

      const hashPassword = await bcript.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: hashPassword,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // created private key , public key
        const { publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "publicKeyString error!",
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        console.log(
          "🚀 ~ AccessService ~ signUp ~ publicKeyObject:",
          publicKeyObject
        );

        // create 2 access token and refresh token
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey
        );

        return {
          code: 201,
          metadata: {
            shop: newShop,
            tokens,
          },
        };
      } else {
        return {
          code: 200,
          metadata: null,
        };
      }
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  }
}

module.exports = AccessService;
