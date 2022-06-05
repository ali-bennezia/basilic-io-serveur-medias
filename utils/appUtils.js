/*
    Utilitaire gérant tout ce qui touche à l'application elle même.
*/

exports.isWhitelistEnabled = () => {
  return process.env.ENABLE_WHITELIST == "true";
};

exports.getApplicationServerIp = () => {
  return process.env.APPLICATION_SERVER_IPv6;
};
