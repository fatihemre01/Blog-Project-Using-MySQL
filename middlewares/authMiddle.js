const jwt = require("jsonwebtoken")
const con = require("../db_connection")

function verifyToken(req, res, next) {
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
            if(err) return res.redirect("/login")
            next()
        })
    } else{
        res.redirect("/login")
    }
}

function checkUser(req, res, next) {
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if(err) {
            res.locals.user = null
            next()
        } else{
            let sql = `SELECT * FROM users WHERE email = ${con.escape(decoded.email)}` 
            con.query(sql, (err, result) => {
                if(err) return res.json(err)
                res.locals.user = result
                next()
            })
            
        }
        })

    } else{
        res.locals.user = null
         next()
    }
}

module.exports = {verifyToken, checkUser}