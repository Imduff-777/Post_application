const express = require("express");
const mongoose = require("mongoose");
const categoria = require("../models/Categoria");
const Categoria = require("../models/Categoria");
const router = express.Router(); //o router, serve para criar rotas que serão chamadas dentro de outra rota no arquivo principal, que no nosso caso é o app.js

router.get("/", (req, res) => {
    res.render("admin/index");
});

router.get("/posts", (req, res) => {
    res.send("página de posts");
});

router.get("/categorias", (req, res) => {
    categoria.Categoria.find()
        .lean()
        .sort({ date: "desc" })
        .then((categoria) => {
            res.render("admin/categorias", { categoria: categoria });
        })
        .catch((err) => {
            console.log(err);
        });
});

router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategoria");
});

router.post("/categorias/nova", (req, res) => {
    let error = [];

    if (
        !req.body.nome ||
        typeof req.body.nome == undefined ||
        req.body.nome == null
    ) {
        error.push({ texto: "Nome inválido" });
    }

    if (
        !req.body.slug ||
        typeof req.body.slug == undefined ||
        req.body.slug == null
    ) {
        error.push({ texto: "slug inválido" });
    }

    if (error.length > 0) {
        res.render("admin/addcategoria", { error: error });
    } else {
        const novaCat = {
            nome: req.body.nome,
            slug: req.body.slug,
            date: Date.now()

        };

        new categoria.Categoria(novaCat)
            .save()
            .then(() => {
                //aqui a variavel flash que estava no arquivo app.js esta recebendo um valor, que é "Categoria cadastrada com sucesso!"
                req.flash("success_msg", "Categoria cadastrada com sucesso!");
                res.redirect("/admin/categorias");
            })
            .catch((err) => {
                //aqui a variavel flash que estava no arquivo app.js esta recebendo um valor, que é "Houve um erro ao cadastrar a categoria"
                req.flash(
                    "error_msg",
                    "Houve um erro ao cadastrar a categoria"
                );

            });

    }
});

router.get("/categorias/edit/:id", (req, res) => {
    categoria.Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("admin/editcategorias", { categoria: categoria })
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })

})

router.post("/categorias/edit", (req, res) => {
    categoria.Categoria.findOne({ _id: req.body.id }).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar categoria")
            res.redirect("/admin/categorias")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria!")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/deletar", (req, res) => {
    categoria.Categoria.findByIdAndRemove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria excluida com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "houve um erro ao deletar a categoria")
        res.redirect("/admin/categorias")
    })
})

//exportando o router para puxar no arquivo principal dentro de outra rota
module.exports = router;
