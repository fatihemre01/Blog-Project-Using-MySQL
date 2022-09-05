const mysql = require("mysql")

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "BlogDB"
})

con.connect((err) => {
    if(err) console.log("Not connected!")
    console.log("Connected to MySQL Database!")
})

module.exports = con