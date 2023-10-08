const express = require("express");
const profileRouter = express.Router();
const urlEncodedParser = express.urlencoded({extended: false});

const authController = require("../controllers/authController.js");
const userController = require("../controllers/userController.js");

profileRouter.get("/", userController.getProfile);
profileRouter.get("/apiary", userController.getApirie);
profileRouter.get("/work/done", userController.getAllDoneWork);
profileRouter.get("/work/scheduled", userController.getAllScheduledWork);
profileRouter.get("/notes", userController.getNotes);
profileRouter.get("/changePasswordPage", userController.getChangePasswordPage);
profileRouter.post("/changePassword", urlEncodedParser, authController.changePassword);
profileRouter.get("/exit", authController.logOut);
profileRouter.get("/delete", authController.deleteProfile);
profileRouter.get("/apiary/createPage", userController.getCreateApiaryPage);
profileRouter.post("/apiary/create", userController.createApiary);
profileRouter.get("/apiary/delete", userController.deleteApiary);
profileRouter.get("/apiary/hive", userController.getHive);
profileRouter.get("/apiary/hive/work/scheduled", userController.getSheduledHiveWork);
profileRouter.get("/apiary/hive/work/done", userController.getDoneHiveWork);
profileRouter.put("/apiary/avatar/update", userController.updateApiaryAvatar);
profileRouter.put("/apiary/hive/avatar/update", userController.updateHiveAvatar);


module.exports = profileRouter;