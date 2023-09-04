//Carregando módulos
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const admin = require("./routes/admin");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash"); //O flash serve para usar sessões rapidas, que somem depressa

//Configurações

//Configurando o flash e o session

app.use(
    session({
        secret: "cursodenode",
        resave: true, //resave: Força o salvamento da sessão no registro de sessões, mesmo se a sessão não foi modificada durante a requisição.
        saveUninitialized: true
    })
);

app.use(flash());

//Crinado um middleware para criar variaveis globais do tipo flash para a mensagem de erro ou sucesso sumir assim que recarregar a página(por isso utilizamos o flash), essas variaveis receberão um valor no arquivo admin.js
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});

app.engine(
    "handlebars",
    handlebars.engine({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//configurando a pasta static do bootstrap
app.use(express.static(path.join(__dirname, "public")));

mongoose.Promise = global.Promise;
mongoose
    .connect("mongodb://127.0.0.1/blogapp")
    .then(() => {
        console.log("conectado ao db");
    })
    .catch((err) => {
        console.log(err);
    });

//Rotas

//puxando todas as rotas que estão em ./router/admin.js e colocando dentro de /admin, exemplo: /admin/posts
app.use("/admin", admin);

app.use((req, res, next) => {
    console.log("middleware");
    next();
});

//Outros
const PORT = 6969;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});
