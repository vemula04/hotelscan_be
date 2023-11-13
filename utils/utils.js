const config = require("../config/config");
const path = require("path");

module.exports = {
    getFileExtension: (fileName) => {
        if (!fileName) return fileName;
        return path.extname(fileName).toLowerCase();

    },

    isVideoType: (ext) => {
        if(!ext) return ext;
        const videoFormats = [
            ".mov",
            ".mp4",
            ".webm",
            ".wmv",
            ".avi"            
        ]
        ext = ext.toLowerCase();
        return videoFormats.includes(ext);
    }
}