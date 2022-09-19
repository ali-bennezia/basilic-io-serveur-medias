/*
    Utilitaire gérant tout ce qui touche au système de fichiers.
*/

const { rejects } = require("assert");
const fs = require("fs");
const { resolve } = require("path");
const util = require("util");

const root = process.env.MEDIA_ROOT + "/";

const getCreationErrorString = (fileName, error) =>
  `Erreur, création du fichier ${fileName} impossible. ${error}`;

exports.createDirectories = function (...directories) {
  try {
    directories.forEach(function (directory) {
      if (!fs.existsSync(root + directory))
        fs.mkdir(root + directory, function (err, res) {
          if (err) console.log(getCreationErrorString(root + directory, err));
        });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.writeFileFromBuffer = function (path, buffer) {
  try {
    fs.writeFile(root + path, buffer, function (err, res) {
      if (err) console.log(getCreationErrorString(root + path, err));
    });
  } catch (err) {
    console.log(err);
  }
};

const getRemovalErrorString = (fileName, error) =>
  `Erreur, suppression du fichier ${fileName} impossible. ${error}`;

exports.deleteFile = function (path) {
  try {
    fs.unlink(root + path, (err) => {
      if (err) console.log(getRemovalErrorString(root + path, err));
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteFiles = function (...paths) {
  try {
    for (el of paths) this.deleteFile(el);
  } catch (err) {
    console.log(err);
  }
};

const getReadErrorString = (fileName, error) =>
  `Erreur, lecture du fichier ${fileName} impossible. ${error}`;

exports.readFileRangeData = function (path, prePath = "", rangeString) {
  path = path.replace("..", "").replace(":", "");
  const fullPath = root + prePath + path;

  if (rangeString == undefined) return null;

  const range = rangeString != null ? this.parseRangeString(rangeString) : null;

  try {
    const stats = fs.statSync(fullPath);
    const sizeInBytes = stats.size;

    const rangeLength =
      range == null
        ? sizeInBytes
        : parseInt(range.max == "*" ? sizeInBytes - 1 : range.max) -
          parseInt(range.min);
    const fd = fs.openSync(fullPath, "r+");

    return {
      rangeHeader: `bytes ${range.min}-${
        range.max == "*" ? sizeInBytes - 1 : range.max
      }/${sizeInBytes}`,
      lengthHeader: `${rangeLength + 1}`,
    };
  } catch (err) {
    console.log(err);
  }
  return null;
};

exports.readFile = async function (path, prePath = "", rangeString = null) {
  path = path.replace("..", "").replace(":", "");
  const fullPath = root + prePath + path;
  const range = rangeString != null ? this.parseRangeString(rangeString) : null;

  try {
    const stats = fs.statSync(fullPath);
    const sizeInBytes = stats.size;

    const rangeLength =
      range == null
        ? sizeInBytes
        : parseInt(range.max == "*" ? sizeInBytes - 1 : range.max) -
          parseInt(range.min) +
          1;

    if (range != null) {
      const filePromise = new Promise((resolve, reject) => {
        fs.open(fullPath, "r", (err, fd) => {
          fs.read(
            fd,
            new Buffer.alloc(rangeLength),
            0,
            rangeLength,
            range == null ? 0 : parseInt(range.min),
            (err, readBytes, buff) => {
              if (err != null) reject(err);
              else resolve(buff);
            }
          );
        });
      });

      return filePromise;
    } else {
      return fs.readFileSync(fullPath);
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};

exports.readPublicFile = async (path, rangeString = null) => {
  return await this.readFile(
    path.replace("..", "").replace("/", ""),
    "public/",
    rangeString
  );
};
exports.readPrivateFile = async (path, rangeString = null) => {
  return await this.readFile(
    path.replace("..", "").replace("/", ""),
    "private/",
    rangeString
  );
};

exports.readPublicFileRangeData = (path, rangeString = null) =>
  this.readFileRangeData(
    path.replace("..", "").replace("/", ""),
    "public/",
    rangeString
  );
exports.readPrivateFileRangeData = (path, rangeString = null) =>
  this.readFileRangeData(
    path.replace("..", "").replace("/", ""),
    "private/",
    rangeString
  );

exports.parseRangeString = (str) => {
  let prs = str.replace("bytes=", "");
  let data = prs.split("-");

  return {
    min: data[0],
    max: data.length > 1 && data[1] != "" ? data[1] : "*",
  };
};
