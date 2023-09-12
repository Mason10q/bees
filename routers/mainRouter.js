const express = require("express");
const mainRouter = express.Router();
const urlEncodedParser = express.urlencoded({extended: false});

const authController = require("../controllers/authController.js");
const mainController = require("../controllers/mainController.js");
    
mainRouter.get("/", mainController.mainPage);
mainRouter.get("/signupPage", mainController.signUpPage);
mainRouter.get("/signinPage", mainController.signInPage);
mainRouter.get("/beesinfo", mainController.beesInfoPage);
mainRouter.post("/signup", urlEncodedParser, authController.signUp);
mainRouter.post("/signin", urlEncodedParser, authController.signIn);

module.exports = mainRouter;