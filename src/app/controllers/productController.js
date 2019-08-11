const express = require("express");
const authMiddleware = require("../middleware/auth");

const Product = require("../models/Product");
//const User = require("../models/User");

const router = express.Router();

router.use(authMiddleware);

router.post("/registerProduct", async (req, res) => {  
  try {
    const product = await Product.create({ ...req.body, user: req.userId });
    return res.send({ product });
  } catch (err) {
    return res.status(404).send({ error: "Erro ao Cadastrar Produto" });
  }
});

router.get("/listProduct", async (req, res) => {
  //res.send({ user: req.userId })
  try {
    const product = await Product.find().populate("user");

    return res.send({ product });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao Listar Produto " });
  }
});

router.get("/:productId", async (req, res) => {
  //res.send({ user: req.userId })
  try {
    const product = await Product.findById(req.params.productId).populate("user");

    return res.send({ product });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao Buscar Produto" });
  }
});

router.put("/:productId", async (req, res) => {
  const { nameProduct, descriptionProduct, moneyProduct, sold } = req.body;
  try {
   
    console.log(nameProduct, descriptionProduct, moneyProduct, sold);

    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        nameProduct,
        descriptionProduct,
        moneyProduct,
        sold
      },
      { new: true }
    );

    await product.save();
    console.log(product);
    return res.send({ product });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao Atualizar Produto" });
  }
});

router.delete("/:productId", async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.productId);

    return res.send();
  } catch (err) {
    return res.status(400).send({ error: "Erro ao Excluir Produto" });
  }
});

module.exports = app => app.use("/product/", router);
