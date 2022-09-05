const jwt = require("jsonwebtoken")
const con = require("../db_connection")

module.exports.get_shareblog = (req, res) => {
    res.render("share-blog.ejs")
}


module.exports.post_shareblog = async (req, res) => {
    const token = req.cookies.jwt
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if(err) return console.log("Invalid token")
        let sql = `SELECT * FROM users WHERE email = ${con.escape(decoded.email)}`
        con.query(sql, (err, result) => {
            if(err) return console.log(err)

            let sql2 = `INSERT INTO blogs (title, content, sharedBy, userId) VALUES ?`
            let values = [
                [req.body.title, req.body.content, result[0].username, result[0].email]
            ]
            con.query(sql2, [values], (err, result) => {
                if(err) return res.json(err)
                res.redirect("/all-blogs")
            })
        })
    })
}

module.exports.get_allblogs = async (req, res) => {
    let sql = `SELECT * FROM blogs`
    con.query(sql, (err, blogs) => {
        if(err) return console.log(err)
        res.render("all-blogs.ejs", {blogs})
    })
}

module.exports.get_readblog = async (req, res) => {
    let sql = `SELECT * FROM blogs WHERE blog_id = ${con.escape(req.params.id)}`
    con.query(sql, (err, blog) => {
        if(err) return console.log(err)
        res.render("read-blog.ejs", {blog})
    })
}

module.exports.get_yourblogs = async (req, res) => {
    const token = req.cookies.jwt
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if(err) return console.log("Invalid token")
        let sql = `SELECT * FROM users WHERE email = ${con.escape(decoded.email)}`
        con.query(sql, (err, user) => {
            if(err) return console.log(err)

            let sql2 = `SELECT * FROM blogs WHERE userId = ${con.escape(user[0].email)}`
            con.query(sql2, (err, blogs) => {
                res.render("your-blogs.ejs", {blogs})
            })
        })
    })
    
}

module.exports.get_editblog = async (req, res) => {
    let sql = `SELECT * FROM blogs WHERE blog_id = ${con.escape(req.params.id)}`
    con.query(sql, (err, blog) => {
        if(err) return console.log(err)
        console.log(blog)
        res.render("edit-blog.ejs", {blog})
    })
}

module.exports.post_editblog = async (req, res) => {
    let sql = `UPDATE blogs
                SET title = ${con.escape(req.body.title)}, content = ${con.escape(req.body.content)}
                WHERE blog_id = ${con.escape(req.params.id)}`
    con.query(sql, (err) => {
        if(err) return console.log(err)
        res.redirect("/your-blogs")
    })
}

module.exports.deleteblog = async (req, res) => {
    let sql = `DELETE FROM blogs WHERE blog_id = ${con.escape(req.params.id)}`
    con.query(sql, (err, result) => {
        if(err) return console.log(err)
        res.redirect("/your-blogs")
    })
}