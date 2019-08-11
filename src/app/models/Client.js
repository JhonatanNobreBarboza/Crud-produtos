const mongoose = require("../../database");

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  cpf: {
    type: String,
    unique: true,
    required: true
  },
  cidade: {
    type: String,
    require: true
  },
  uf: {
    type: String,
    require: true
  },
  bairro:{
    type: String,
    required: true
  },
  logadouro: {
    type: String,
    require: true
  },
  numero: {
    type: String,
    require: true
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

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
