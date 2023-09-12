const express = require("express");
var session = require('express-session');
const multer  = require("multer");


const mainRouter = require("./routers/mainRouter.js");
const profileRouter = require("./routers/profileRouter.js");


global.__approot = __dirname;

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, __dirname + "/public/images/");
    },
    filename: (req, file, cb) =>{
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
 
const app = express();

app.use(session({secret: 'ssshhhhh', saveUninitialized: true, resave: true}));
app.use(multer({storage:storageConfig}).single("picture"));
app.use("/public/", express.static(__dirname + '/public/'));

app.use("", mainRouter);
app.use("/profile", profileRouter);

app.listen(3000);