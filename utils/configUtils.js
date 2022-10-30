const compulsoryEnvVariables = [
  "APPLICATION_SERVER_IPv6",
  "APPLICATION_SERVER_ADRESS",
  "MEDIA_ROOT",
  "HTTPS_PRIVATE_KEY_FILE",
  "HTTPS_CERTIFICATE_FILE",
];

exports.checkEnvVariables = () => {
  let missing = [];
  for (let eVar of compulsoryEnvVariables) {
    if (!process.env[eVar]) missing.push(eVar);
  }

  if (missing.length != 0) {
    let plural = missing.length != 1;
    throw `${!plural ? "La" : "Les"} variable${
      plural ? "s" : ""
    } d'environnement obligatoire${plural ? "s" : ""} ${missing} ${
      plural ? "sont" : "est"
    } manquante${plural ? "s" : ""}.`;
  }
};
