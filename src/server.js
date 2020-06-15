const express = require("express")
const server = express()

//pegar o bd

const db = require("./database/db.js")

//configurar pasta public
server.use(express.static("public"))

//habilitar o uso do req.body

server.use(express.urlencoded({ extended: true }))


//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//configurar caminhos para a aplicação

//pagina inicial
//req: requisição(pedido)
//res: reposta
server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um título" })

})

//criar rotas para outras abas
server.get("/create-point", (req, res) => {

    //console.log(req.query)

    return res.render("create-point.html")

})

server.post("/savepoint", (req, res) => {

    //req.body o corpo do form
    //console.log(req.body)

    //inserir dados no banco de dados

    const query = `
     INSERT INTO places (
         image,
         name,
         address,
         address2,
         state,
         city,
         items
     ) VALUES (?,?,?,?,?,?,?);
 `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            return console.log(err)
        }
        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true })

    }

    db.run(query, values, afterInsertData)


})

server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == ""){
        //pesquisa vazia
        return res.render("search-results.html", { total: 0 })
    }


    //pegar dados do db

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err)
        }

        //contar total de elementos
        const total = rows.length

        //mostrar a pagina html com os dados do banco
        return res.render("search-results.html", { places: rows, total: total })
    })

})

//ligar o servidor
server.listen(3000)