//Configuration initiale.

const express = require("express");
const fs = require("fs");
const https = require("https");
const dotenv = require("dotenv");
const app = express();
const configUtils = require("./utils/configUtils");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
configUtils.checkEnvVariables();

const port = parseInt(process.env.DEFAULT_PORT ?? 5001);
const sport = parseInt(process.env.DEFAULT_SECURE_PORT ?? 5444);

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

app.use((req, res, next) => {
  res.set("Accept-Ranges", "bytes");
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");

  next();
});

app.use("/api/medias", mediaRouter);

//Execution écoute non sécurisée.
app.listen(port, () => {
  console.log(`Serveur de média lancé et à l'écoute sur le port ${port}.`);
});

//Execution écoute sécurisée.
https
  .createServer({
    key: process.env.HTTPS_PRIVATE_KEY_FILE,
    cert: process.env.HTTPS_CERTIFICATE_FILE,
  })
  .listen(sport, () => {
    console.log(
      `(HTTPS) Serveur de média lancé et à l'écoute sur le port ${sport}.`
    );
  });
