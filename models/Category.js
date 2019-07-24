const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  title: { type: String, require: true },
  viewerCount: { type: String, require: true }
});

const Category = mongoose.model("Category", CategorySchema);

// Export the Category model
module.exports = Category;
