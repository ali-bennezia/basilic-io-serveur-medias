const compulsoryEnvVariables = ["APPLICATION_SERVER_ADRESS", "MEDIA_ROOT"];

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
