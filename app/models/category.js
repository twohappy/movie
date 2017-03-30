/**
 * Created by twohappy on 2017/3/28.
 */
const mongoose = require('mongoose');
const CategorySchema = require('../schemas/category');
const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;