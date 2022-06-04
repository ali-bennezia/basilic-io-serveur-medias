/*Middleware dont le but est de ne permettre les requêtes:

    - Dans le cas ou la whitelist est activée, seulement si la requête provient du serveur d'application.
    - Si la whitelist est désactivée, la permettre en tout temps.

*/

const appUtils = require("../utils/appUtils");

module.exports = async function (req, res, next) {
  try {
    if (
      appUtils.isWhitelistEnabled() &&
      req.ip != appUtils.getApplicationServerIp()
    ) {
      res.status(403).json("Forbidden");
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};
