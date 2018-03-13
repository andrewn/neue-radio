const replaceEmojiWithDescriptions = require("emoji-describe");

module.exports = (str = "") => replaceEmojiWithDescriptions(str);
