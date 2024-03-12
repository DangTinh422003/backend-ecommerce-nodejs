const { model } = require("mongoose");
const bcript = require("bcrypt");
const shopModel = require("../models/shop.model");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");

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
        roles: RoleShop.SHOP,
      });

      if (newShop) {
        // created private key , public key
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });

        const publicKeyString = await KeyTokenService.createToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "publicKeyString error!",
          };
        }

        // create 2 token
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );

        console.log(tokens);
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
