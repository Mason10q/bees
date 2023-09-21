const express = require("express");
const profileRouter = express.Router();

const userController = require("../controllers/userController.js");

profileRouter.get("/", userController.getProfile);
profileRouter.get("/apirie", userController.getApirie);
profileRouter.get("/sheduleWork", userController.getAllScheduledWork)
profileRouter.get("/doneWork", userController.getAllDoneWork);


module.exports = profileRouter;