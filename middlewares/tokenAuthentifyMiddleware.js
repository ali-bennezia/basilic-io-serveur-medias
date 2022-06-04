/**
 * Middleware dont le but est la récupération ainsi que l'authentification du token envoyé dans la requête.
 */

const authUtils = require("../utils/authUtils");

/*Verification des droits d'accès au token.
  On demande au serveur d'application si le token envoyé en header a le droit d'avoir accès au média privé.
*/
exports.checkTokenPrivateMediaAccess = async function (req, res, next) {
  try {
    if (
      !"headers" in req ||
      !req.headers ||
      !"authorization" in req.headers ||
      !req.headers.authorization
    )
      return res.status(401).json("Unauthorized");

    let token = req.headers.authorization.replace("Bearer ", "");

    await authUtils.authentifyToken(
      token,
      [req.params.mediaFileName],
      (tokenData) => {
        let fullAuthorization = false;
        if (
          tokenData &&
          "data" in tokenData &&
          tokenData.data &&
          "mediaAuthorizations" in tokenData.data &&
          tokenData.data.mediaAuthorizations &&
          Array.isArray(tokenData.data.mediaAuthorizations)
        ) {
          let authResults = tokenData.data.mediaAuthorizations.map(
            (el) => el.authorization
          );
          fullAuthorization = !authResults.includes(false);
        }

        if (
          !tokenData ||
          !tokenData.data ||
          !tokenData.data.authentic ||
          !fullAuthorization
        ) {
          console.log(tokenData);
          console.log(fullAuthorization);
          res.status(403).json("Forbidden");
        } else {
          next();
        }
      }
    );
  } catch (err) {
    res.status(500).json("Internal Server Error");
    console.log(err);
  }
};
