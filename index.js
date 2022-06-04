//Configuration initiale.

const express = require("express");
const dotenv = require("dotenv");
const app = express();
const configUtils = require("./utils/configUtils");

dotenv.config();
configUtils.checkEnvVariables();

const port = parseInt(process.env.DEFAULT_PORT ?? 5001);
const enableWhitelist = process.env.ENABLE_WHITELIST == "true";

console.log(`Configuration chargée.

    Port: ${port},
    Whitelist: ${enableWhitelist}
`);

//Utilitaires
const fileUtils = require("./utils/fileUtils");

//Création des fichiers public et private si inexistants.
fileUtils.createDirectories("", "public", "private");

//Routage.
const mediaRouter = require("./routers/mediaRouter");

app.use("/api/medias", mediaRouter);

//Execution.
app.listen(port, () => {
  console.log(`Serveur de média lancé et à l'écoute sur le port ${port}.`);
});
