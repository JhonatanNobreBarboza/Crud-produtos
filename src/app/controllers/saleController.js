const express = require("express");
const authMiddleware = require("../middleware/auth");

const Sale = require("../models/Sale");
const Product = require("../models/Product");
//const Client = require("../models/Client");

const router = express.Router();

router.use(authMiddleware);

router.get("/listSales", async (req, res) => {
  try {
    const sale = await Sale.find().populate("user");

    return res.send({ sale });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao Listar Vendas" });
  }
});

router.get("/:saleId", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.saleId).populate(
      "sale"
    );

    return res.send({ sale });
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Erro ao Buscar Vendas" });
  }
});

router.post("/sale", async (req, res) => {
   try {
    const data = req.body;
    console.log(data.sale);

    const sale = await Sale.create({
      ...data,
      client: data.clienteId,
      product: data.productId,
      sale: data.saleId,
      user: data.userId
    });

    await Product.findOneAndUpdate({_id: data.product, sold:false}, {$set:{sold : true}}, {upsert:true});
    
    return res.send({ sale });
  } catch (err) {
    return res
      .status(400)
      
      .send({ error: "Esta produto já está Vendido" });
  }
});
    
 router.put("/:saleId", async (req, res) => {
   try {
     const { Client, Product, dateSale, qtd, MoneySale } = req.body;
     console.log(sale);

     const sale = await Sale.findByIdAndUpdate(
       req.params.saleId,
       {
         Client,
         Product,
         dateSale,
         qtd,
       },
       { new: true }
     );

     await sale.save();
     console.log(sale);
     return res.send({ sale });
   } catch (err) {
     return res.status(400).send({ error: "Erro ao Atualizar Venda" });
   }
 });

 router.delete("/:saleId", async (req, res) => {
   try {
     await Sale.findByIdAndRemove(req.params.saleId);

     return res.send();
   } catch (err) {
     return res
       .status(400)
       .send({ error: "Erro ao Excluir Venda" });
   }
 });

module.exports = app => app.use("/sale", router);
