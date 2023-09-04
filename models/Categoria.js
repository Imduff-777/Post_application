const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoria = new Schema({
    nome: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true
    },

    date: {
        type: Date,
    }
});

const Categoria = mongoose.model("categorias", categoria);

module.exports = {
    Categoria: Categoria
};
