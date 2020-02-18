// server config
const express = require('express')
const server = express()

// configure server to display static files
server.use(express.static('public'))

server.use(express.urlencoded({ extended: true }))

// configuring the connection with database
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '08808008',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// configuring the template engine
const nunjucks = require('nunjucks')
nunjucks.configure('./', {
    express: server,
    noCache: true
})


// configure the page layout
server.get('/', function (req, res) {

    db.query("SELECT * FROM donors", function (err,result) {
        if (err) return res.send('Database error.')

        const donors = result.rows
        return res.render('index.html', { donors })

    })

})

server.post('/', function (req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send('Todos os campos são obrigatórios.')
    }

    // put values inside the database
    const query = `
    INSERT INTO donors ("name","email","blood") 
    VALUES($1,$2,$3)`

    const values = [name, email, blood]

    db.query(query, values, function (err) {
        if (err) return res.send('database error')

        return res.redirect('/')
    })

})

// turn on the server and allow access on port 3000
server.listen(3000, function () {
    console.log('server started!')
})

