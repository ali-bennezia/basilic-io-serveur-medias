//Utilitaires
const fileUtils = require("./../utils/fileUtils");

// POST /api/medias/post/:mediaPath
exports.postMedia = async function (req, res) {
  try {
    fileUtils.writeFileFromBuffer(req.params.mediaPath, req.file.buffer);
    res.status(201).json("OK");
  } catch (err) {
    res.status(500).json("Internal Server Error");
    console.log(err);
  }
};

// DELETE /api/medias/delete/:mediaPath
exports.deleteMedia = async function (req, res) {
  try {
    fileUtils.deleteFile(req.params.mediaPath);
    res.status(200).json("OK");
  } catch (err) {
    res.status(500).json("Internal Server Error");
    console.log(err);
  }
};

// GET /api/medias/public/get/:mediaFileName
exports.getPublicMedia = async function (req, res) {
  try {
    if (!"mediaFileName" in req.params)
      return res.status(400).json("Bad Request");
    const fileData = fileUtils.readPublicFile(req.params.mediaFileName);
    if (!fileData) return res.status(404).json("Not Found");
    res.status(200).end(fileData, "binary");
  } catch (err) {
    res.status(500).json("Internal Server Error");
    console.log(err);
  }
};

// GET /api/medias/private/get/:mediaFileName
exports.getPrivateMedia = async function (req, res) {
  try {
    if (
      !"mediaFileName" in req.params ||
      !req.params.mediaFileName.startsWith("private/")
    )
      return res.status(400).json("Bad Request");
    const fileData = fileUtils.readFile(req.params.mediaFileName);
    if (!fileData) return res.status(404).json("Not Found");
    res.status(200).end(fileData, "binary");
  } catch (err) {
    res.status(500).json("Internal Server Error");
    console.log(err);
  }
};
