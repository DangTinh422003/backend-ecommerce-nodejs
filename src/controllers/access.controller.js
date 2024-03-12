const AccessService = require("../services/access.service");

class AccessController {
  async signUp(req, res, next) {
    try {
      console.log(`[P]:::signUp::`, req.body);
      return res.status(201).json(await AccessService.signUp(req.body));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AccessController();
