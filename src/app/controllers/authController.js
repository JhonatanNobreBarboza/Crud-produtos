const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
//var nodemailer = require("nodemailer");

//const mailer = require("../../modules/mailer");
const authConfig = require("../../config/auth");

const User = require("../models/User");

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
}


router.post("/registerUser", async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ error: "Este usuário já existe" });

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({
      user,
      token: generateToken({ id: user.id })
    });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao efetuar Registro" });
  }
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) return res.status(400).send({ error: "Usuário não encontrado!" });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).send({ error: "Senha não confere!" });

  user.password = undefined;

  res.send({
    user,
    token: generateToken({ id: user.id })
  });
});


router.get("/listUsers", async (req, res) => {
  //res.send({ user: req.userId })
  try {
    const user = await User.find().populate("user");

    return res.send({ user });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao Listar Usuários " });
  }
});

router.get("/:userId", async (req, res) => {
  //res.send({ user: req.userId })
  try {
    const user = await User.findById(req.params.userId).populate("user");

    return res.send({ user });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao Buscar Usuário" });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.userId);

    return res.send();
  } catch (err) {
    return res.status(400).send({ error: "Erro ao Excluir Usuário" });
  }
});

router.post("/esqueci_senha", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).send({ error: "Usuário não encontrado!" });

    const token = crypto.randomBytes(20).toString("hex");

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    });
    console.log(token, now);
    mailer.sendMail(
      {
        to: email,
        from: "jhonatan.souza@novaandradina.org",
        template: "auth/esqueci_senha",
        context: { token }
      },
      err => {
        if (err)
          return res
            .status(400)
            .send({ error: "Não foi possível enviar o email de senha" });

        return res.send();
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: "Erro na senha tente novamente" });
  }
});

router.post("/reset_senha", async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const user = await User.findOne({ email }).select(
      "+ passwordResetToken passwordResetExpires"
    );

    if (!user)
      return res.status(400).send({ error: "Este usuário não existe" });

    if (token !== user.passwordResetToken) {
      return res.status(400).send({ error: "Token Inválido" });
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
      return res.status(400).send({ error: "Este Token Expirou Gere um novo" });
    }

    user.password = password;

    await user.save();

    res.send();
  } catch (err) {
    res.status(400).send({ error: "Erro ao resetar a senha" });
  }
});

module.exports = app => app.use("/auth/", router);
