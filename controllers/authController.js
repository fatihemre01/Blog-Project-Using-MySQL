const con = require("../db_connection")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

function createToken(email) {
    return jwt.sign({email}, process.env.TOKEN_SECRET)
}

module.exports.get_signup = (req, res) => {
    res.render("signup.ejs")
}

module.exports.get_login = (req, res) => {
    res.render("login.ejs")
}

module.exports.post_signup = async (req, res) => {
    let sql = `SELECT * FROM users WHERE email = ${con.escape(req.body.email)}`
    con.query(sql, async (err, result) => {
        if(result.length) return res.json("User already registered before!")

        const hashedPass = await bcrypt.hash(req.body.password, 10)

        let sql = "INSERT INTO users(username,email,password) Values ?"
        let values = [
            [req.body.username, req.body.email, hashedPass]
        ]

        con.query(sql, [values], (err, result) => {
            if(err) return res.json(err)
            res.redirect("/login")
        })
    })
}

module.exports.post_login = async (req, res) => {
    let sql = `SELECT * FROM users WHERE email = ${con.escape(req.body.email)}`
    
    con.query(sql, async (err, result) => {
        if(err) return res.json(err)
        if(!result.length) return res.json("Email or password is wrong!")
        const validatePass = await bcrypt.compare(req.body.password, result[0].password)
        if(validatePass) {
            const token = createToken(result[0].email)
            res.cookie("jwt", token)
            res.redirect("/")
        } else{
            res.json("Email or password is wrong!")
        }
    })
}

module.exports.logout = (req, res) => {
    res.cookie("jwt", "", {maxAge: 1})
    res.redirect("/")
}