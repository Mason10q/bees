const express = require("express");
const profileRouter = express.Router();
const urlEncodedParser = express.urlencoded({extended: false});

const authController = require("../controllers/authController.js");
const userController = require("../controllers/userController.js");

profileRouter.get("/", userController.getProfile);
profileRouter.get("/apiary", userController.getApirie);
profileRouter.get("/sheduleWork", userController.getAllScheduledWork)
profileRouter.get("/doneWork", userController.getAllDoneWork);
profileRouter.get("/scheduledWork", userController.getAllScheduledWork);
profileRouter.get("/notes", userController.getNotes);
profileRouter.get("/changePasswordPage", userController.getChangePasswordPage);
profileRouter.post("/changePassword", urlEncodedParser, authController.changePassword);
profileRouter.get("/exit", authController.logOut);
profileRouter.get("/delete", authController.deleteProfile);
profileRouter.get("/createApiaryPage", userController.getCreateApiaryPage);
profileRouter.post("/createApiary", userController.createApiary);
profileRouter.get("/apiary/delete", userController.deleteApiary);


module.exports = profileRouter;