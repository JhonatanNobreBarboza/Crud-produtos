const mongoose = require("../../database");

const SaleSchema = mongoose.Schema({
  dateSale: {
    type: Date,
    default: Date.now
  },
  qtd: {
    type: Number,
    require: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    require: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    require: true
  },
  moneyFind: {
    type: Number,
    require:true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  }
});

const Sale = mongoose.model("Sale", SaleSchema);

module.exports = Sale;
