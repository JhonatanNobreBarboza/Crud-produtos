const mongoose = require("../../database");

const ProductSchema = new mongoose.Schema({
  nameProduct: {
    type: String,
    unique: true,
    required: true
  },
  descriptionProduct: {
    type: String,
  },
  moneyProduct: {
    type: String,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  sold: {
    type: String,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
