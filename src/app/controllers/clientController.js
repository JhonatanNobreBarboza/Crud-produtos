const express = require("express");
const authMiddleware = require("../middleware/auth");

const Client = require("../models/Client");


const router = express.Router();

router.use(authMiddleware);

router.post("/registerClient", async (req, res) => {
  //res.send({ user: req.userId })
  const client = await Client.create({ ...req.body, user: req.userId });
  try {
    return res.send({ client });
  } catch (err) {
    return res.status(404).send({ error: "Erro ao Cadastrar Cliente" });
  }
});

router.get("/listClients", async (req, res) => {
  //res.send({ user: req.userId })
  const clients = await Client.find().populate("user");
  try {
    

    return res.send({ clients });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao Listar Clientes" });
  }
});

router.get("/:clienteId", async (req, res) => {
  //res.send({ user: req.userId })
  try {
    const client = await Client.findById(req.params.clienteId).populate("user");

    return res.send({ client });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao Buscar Cliente" });
  }
});

router.put("/:clienteId", async (req, res) => {
  const { name, email, cpf, cidade, uf, bairro, logadouro, numero } = req.body;
  try {
   
    console.log(name, email, cpf, cidade, uf, logadouro, numero);

    const client = await Client.findByIdAndUpdate(
      req.params.clienteId,
      {
        name,
        email,
        cpf,
        cidade,
        uf,
        bairro,
        logadouro,
        numero
      },
      { new: true }
    );

    await client.save();
    console.log(client);
    return res.send({ client });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao Atualizar Cliente" });
  }
});


router.delete("/:clienteId", async (req, res) => {
  try {
    await Client.findByIdAndRemove(req.params.clienteId);

    return res.send();
  } catch (err) {
    return res.status(400).send({ error: "Erro ao Excluir Cliente" });
  }
});

module.exports = app => app.use("/cliente/", router);
