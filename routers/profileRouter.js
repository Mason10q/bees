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
profileRouter.put("/notes/update", userController.updateNote)
profileRouter.delete("/notes/delete", userController.deleteNote);
profileRouter.post("/notes/insert", userController.insertNote);

profileRouter.get("/changePasswordPage", userController.getChangePasswordPage);
profileRouter.post("/changePassword", urlEncodedParser, authController.changePassword);
profileRouter.get("/exit", authController.logOut);
profileRouter.delete("/delete", authController.deleteProfile);
profileRouter.get("/apiary/createPage", userController.getCreateApiaryPage);
profileRouter.post("/apiary/create", userController.createApiary);

profileRouter.get("/apiary/delete", userController.deleteApiary);

profileRouter.get("/apiary/hive", userController.getHive);

profileRouter.get("/apiary/hive/work/scheduled", userController.getScheduledHiveWork);
profileRouter.get("/apiary/hive/work/done", userController.getDoneHiveWork);
profileRouter.post("/apiary/hive/work/insert", userController.insertWork);
profileRouter.put("/apiary/hive/work/update", userController.updateWork);
profileRouter.delete("/apiary/hive/work/delete", userController.deleteWork);
profileRouter.put("/apiary/hive/work/makeDone", userController.makeWorkDone);

profileRouter.put("/apiary/avatar/update", userController.updateApiaryAvatar);
profileRouter.put("/apiary/hive/avatar/update", userController.updateHiveAvatar);

profileRouter.get("/apiary/redact", userController.getRedactApiaryPage);

module.exports = profileRouter;