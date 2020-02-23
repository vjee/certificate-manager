const Path = require("path");
const Fs = require("fs").promises;
const FsConstants = require("fs").constants;
const Ejs = require("ejs");
const Logger = require("./Logger");
const asyncFilter = require("./../lib/asyncFilter");

const { CM_PATH_SITES } = process.env;

class FileSystem {
  static path(path) {
    return Path.resolve(path ? path : CM_PATH_SITES);
  }

  static resolve(path, basename) {
    return Path.join(FileSystem.path(path), basename);
  }

  static async getSymbolicLinks(path) {
    const folderItems = await Fs.readdir(FileSystem.path(path)).catch(
      Logger.error
    );
    const symbolicLinks = await asyncFilter(
      folderItems,
      FileSystem.isSymbolicLink(path)
    );
    return symbolicLinks;
  }

  static isSymbolicLink(path) {
    return async basename => {
      const filePath = FileSystem.resolve(path, basename);
      const stats = await FileSystem.stats(filePath);
      return stats.isSymbolicLink();
    };
  }

  static async stats(filePath) {
    const stats = await Fs.lstat(filePath).catch(Logger.error);
    return stats;
  }

  static async writeTemplate(path, basename, templateName, templateData) {
    const renderedTemplateContents = await FileSystem.renderTemplate(
      templateName,
      templateData
    );
    await FileSystem.writeFile(path, basename, renderedTemplateContents);
  }

  static async renderTemplate(templateName, templateData) {
    const templatePath = Path.join(__dirname, "..", "templates");
    const templateContents = await FileSystem.readFile(
      templatePath,
      templateName
    );
    const rendered = Ejs.render(templateContents, templateData);
    return rendered;
  }

  static async readFile(path, basename) {
    const targetFile = FileSystem.resolve(path, basename);
    const contents = await Fs.readFile(targetFile, "utf-8").catch(Logger.error);
    return contents;
  }

  static async appendFile(path, basename, contents) {
    await Fs.appendFile(
      FileSystem.resolve(path, basename),
      "\n" + contents,
      "utf-8"
    ).catch(Logger.error);
  }

  static async writeFile(path, basename, contents) {
    const targetFile = FileSystem.resolve(path, basename);
    await Fs.writeFile(targetFile, contents, "utf-8").catch(Logger.error);
  }

  static async removeFile(path, basename) {
    const targetFile = FileSystem.resolve(path, basename);
    const exists = await Fs.access(targetFile, FsConstants.F_OK);
    if (!exists) return;
    await Fs.unlink(path);
  }
}

module.exports = FileSystem;
