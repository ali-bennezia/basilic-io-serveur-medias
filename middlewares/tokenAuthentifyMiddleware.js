/**
 * Middleware dont le but est la récupération ainsi que l'authentification du token envoyé dans la requête.
 */

const authUtils = require("../utils/authUtils");

/*
  Verification des droits d'accès au token.
  On demande au serveur d'application si le token envoyé en header a le droit d'avoir accès au média privé dans le paramètre req.params.mediaFileName.
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

    if (!"mediaFileName" in req.params || !req.params.mediaFileName)
      return res.status(400).json("Bad Request");

    let token = req.headers.authorization.replace("Bearer ", "");
    //Envoi d'une demande d'authentification des droits d'accès au média req.params.mediaFileName au serveur d'application, avec le token reçu.
    await authUtils.authentifyToken(
      token,
      [req.params.mediaFileName],
      (tokenData) => {
        let fullAuthorization = false;

        //Dès reception d'informations du token, on vérifie la conformité des données et les droits d'accès reçus du serveur d'application.
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

        //Si une donnée manque, ou si les droits d'accès ne sont pas complets, on refuse la requête en 403 Forbidden.
        if (
          !tokenData ||
          !tokenData.data ||
          !tokenData.data.authentic ||
          !fullAuthorization
        ) {
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
