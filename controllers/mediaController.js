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

// POST /api/medias/deletemany
exports.deleteMedias = async function (req, res) {
  try {
    if (
      !"body" in req ||
      !req.body ||
      !"list" in req.body ||
      !req.body.list ||
      !Array.isArray(req.body.list) ||
      req.body.list.length == 0
    )
      return res.status(400).json("Bad Request");

    fileUtils.deleteFiles(...req.body.list);
    res.status(200).json("OK");
  } catch (err) {
    res.status(500).json("Internal Server Error");
    console.log(err);
  }
};

// GET /api/medias/public/get/:mediaFileName
exports.getPublicMedia = async function (req, res) {
  try {
    if (!("mediaFileName" in req.params))
      return res.status(400).json("Bad Request");

    if ("range" in req.headers) {
      const rangeStrData = fileUtils.parseRangeString(req.headers.range);
      const rangeData = fileUtils.readPublicFileRangeData(
        req.params.mediaFileName,
        req.headers.range
      );

      const fileData = await fileUtils.readPublicFile(
        req.params.mediaFileName,
        req.headers.range
      );

      if (!fileData) return res.status(404).json("Not Found");

      res.set("Content-Range", rangeData.rangeHeader);
      res.set("Content-Length", rangeData.lengthHeader);

      return res.status(206).end(fileData, "binary");
    } else {
      const fileData = await fileUtils.readPublicFile(req.params.mediaFileName);
      if (!fileData) return res.status(404).json("Not Found");

      return res.status(200).end(fileData, "binary");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json("Internal Server Error");
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
    if ("range" in req.headers) {
      const rangeStrData = fileUtils.parseRangeString(req.headers.range);
      const rangeData = fileUtils.readPublicFileRangeData(
        req.params.mediaFileName,
        req.headers.range
      );

      const fileData = await fileUtils.readPublicFile(
        req.params.mediaFileName,
        req.headers.range
      );

      if (!fileData) return res.status(404).json("Not Found");

      res.set("Content-Range", rangeData.rangeHeader);
      res.set("Content-Length", rangeData.lengthHeader);

      return res.status(206).end(fileData, "binary");
    } else {
      const fileData = await fileUtils.readFile(req.params.mediaFileName);
      if (!fileData) return res.status(404).json("Not Found");
      res.status(200).end(fileData, "binary");
    }
  } catch (err) {
    res.status(500).json("Internal Server Error");
    console.log(err);
  }
};
