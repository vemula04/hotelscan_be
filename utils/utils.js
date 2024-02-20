const config = require("../config/config");
const path = require("path");
const fs = require('fs');
      
module.exports = {
  getFileExtension: (fileName) => {
    if (!fileName) return fileName;
    return path.extname(fileName).toLowerCase();
  },

  isVideoType: (ext) => {
    if (!ext) return ext;
    const videoFormats = [".mov", ".mp4", ".webm", ".wmv", ".avi"];
    ext = ext.toLowerCase();
    return videoFormats.includes(ext);
  },
  prepareAndSendAPIResponse: async (res, status = 200, data = [], message = "success") => {
    try {
      console.log("prepareAndSendAPIResponse");
      res.send({
        statusCode: status,
        data: data,
        message: message,
      });
    } catch (err) {
      res.send({
        statusCode: 400,
        data: {},
        message: err?.message
          ? err.message
          : "Error while processing your request",
      });
      console.log("Error :: ", err?.message);
    }
  },
  deleteAFile: async (filePath = "") => {
    try{
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File deleted successfully!');
          return "success";
        }
      });      
    } catch (err){      
      console.log("EXCEPTION OCCURRED :: deleteAFile", err);
      console.error(err)
    }
  }
};
