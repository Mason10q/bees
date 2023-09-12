const mysql = require('mysql');
const crypto = require('node:crypto');
const dotenv = require('dotenv');
const { res } = require('express');
const { assert } = require('node:console');

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

        isPasswordCorrect(rows[0].password, password, function(isCorrect){
            if(isCorrect){
                res.redirect("/profile/apirie", {user_id: rows[0].id});
            } else{
                res.redirect("/signInPage");
            }
        });
    });

    db.end();
}