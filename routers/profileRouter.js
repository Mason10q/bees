const express = require("express");
const profileRouter = express.Router();

const userController = require("../controllers/userController.js");

profileRouter.get("/apirie", userController.getApirie);

module.exports = profileRouter;