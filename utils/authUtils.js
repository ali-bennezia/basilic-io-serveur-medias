/*
    Utilitaire gérant tout ce qui touche à l'authentification, par le bias du serveur d'application.
*/

//TODO : A continuer, une fois le serveur d'application déployé

const axios = require("axios");

/*
    Ici, requestedMedias doit être une liste contant des chemins d'accès de médias, afin de demander au serveur d'application
    si le token envoyé y a accès.
*/

exports.authentifyToken = async function (token, requestedMedias, callback) {
  let data = {
    token: token,
    mediaAuthorizations: requestedMedias,
  };

  axios
    .post(
      `http://${process.env.APPLICATION_SERVER_ADRESS}/api/auth/token/authentify`,
      data
    )
    .then((data) => {
      callback(data);
    })
    .catch((err) => {
      console.log(err);
      callback(null);
    });
};
