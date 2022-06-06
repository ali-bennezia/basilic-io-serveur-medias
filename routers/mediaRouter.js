//Configuration initiale

const express = require("express");
const multer = require("multer");

const router = express.Router();
const controller = require("./../controllers/mediaController");

//Middlewares

const whitelistMiddleware = require("../middlewares/whitelistMiddleware");
const tokenAuthentifyMiddleware = require("../middlewares/tokenAuthentifyMiddleware");

//Routes

// POST /api/medias/post/:mediaPath
// Enregistre un média sur le système de fichiers.
router.post(
  "/post/:mediaPath",
  whitelistMiddleware,
  multer().single("media"),
  controller.postMedia
);

// DELETE /api/medias/delete/:mediaPath
// Supprime un média sur le système de fichiers.
router.delete(
  "/delete/:mediaPath",
  whitelistMiddleware,
  controller.deleteMedia
);

// DELETE /api/medias/delete/:mediaPath
// Supprime plusieurs médias sur le système de fichiers.
router.delete("/deletemany", whitelistMiddleware, controller.deleteMedias);

// GET /api/medias/public/get/:mediaFileName
// Récupère un média et l'envoie.
router.get("/public/get/:mediaFileName", controller.getPublicMedia);

// GET /api/medias/private/get/:mediaFileName
// Vérifie si le token envoyé possède les droits pour, récupère un média privé et l'envoie.
router.get(
  "/private/get/:mediaFileName",
  tokenAuthentifyMiddleware.checkTokenPrivateMediaAccess,
  controller.getPrivateMedia
);

module.exports = router;
