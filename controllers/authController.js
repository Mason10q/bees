const mysql = require('mysql');
const crypto = require('node:crypto');
const dotenv = require('dotenv');
const alert = require('alert');

function getConfig() {
    return dotenv.config({path: __approot + '/.env'});
}

function getDb() {
    let config = getConfig();
    return mysql.createConnection({
        host: config.parsed.DB_HOST,
        user: config.parsed.DB_USER,
        database: config.parsed.DB_NAME,
        password: config.parsed.DB_PASS
    });
}

function hashPassword(password, callback) {
    let config = getConfig().parsed;
    crypto.pbkdf2(password, config.SALT, Number(config.ITERATIONS), 64, config.METHOD, function(ee, derivedKey){
        callback(derivedKey.toString('hex'));
    });
}

function isPasswordCorrect(savedHash, passwordAttempt, callback) {
    let config = getConfig().parsed;
    crypto.pbkdf2(passwordAttempt, config.SALT, Number(config.ITERATIONS), 64, config.METHOD, function(ee, derivedKey){
        callback(derivedKey.toString('hex') == savedHash);
    });
}


exports.signUp = (req, res) => {
    let db = getDb();
    const { username, name, email, password, location } = req.body

    db.connect();

    hashPassword(password, (hash) => {
        let query = "INSERT INTO Users SET?";

        db.query(query, {username: username, name: name, email: email, password: hash, location: location}, (err, rows, fields)=>{
            res.redirect("/signinPage");
        });
        
        db.end();
    });
}


exports.signIn = (req, res) => {
    let db = getDb();
    let email = req.body.email;
    let password = req.body.password;

    db.connect();

    let query = "SELECT id, password \
                    FROM Users \
                    WHERE email = ? \
                    LIMIT 1";

    db.query(query, [email], (err, rows, fields) => {

        if(rows === undefined || rows.length === 0){
            alert("Такая почта не \n зарегестрирована");
            return;
        }

        isPasswordCorrect(rows[0].password, password, (isCorrect) => {
            if(isCorrect){
                req.session.user_id = rows[0].id;
                res.redirect("/profile/apiary/");
            } else{
                alert("Пароль неверный");
                return;
            }
        });
    });

    db.end();
}


exports.changePassword = (req, res) => {
    let db = getDb();
    const { password, oldPassword } = req.body
    let user_id = req.session.user_id;
    db.connect();

    let getQuery = "SELECT password FROM Users \
                    WHERE id = ?";

    let updateQuery = "UPDATE Users \
                        SET password = ? \
                        WHERE id = ?";

    db.query(getQuery, [user_id], (err, rows, fields)=>{
        isPasswordCorrect(rows[0].password, oldPassword, (isCorrect) => {
            if(isCorrect){
                hashPassword(password, (hash) => {            
                    db.query(updateQuery, [hash, user_id], (err, rows, fields) => {
                        res.redirect("/signinPage");
                        alert("Пароль успешно заменен");
                        db.end();
                    });
                });
                
            } else{
                alert("Старый пароль введён неверно");
                return;
            }
        });
    });

}


exports.logOut = (req, res) => {
    req.session.clear;
    res.redirect("/");
}


exports.deleteProfile = (req, res) => {
    let db = getDb();
    let user_id = req.session.user_id;
    let query = "DELETE FROM Users WHERE id = ?";

    db.connect();

    db.query(query, [user_id], (err, rows, fields) => {
        res.redirect("/");
    });
}