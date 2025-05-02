// routes/memberRouter.js
const { Router } = require("express");
const membersController = require("../controllers/memberControllers");
const membersRouter = Router();

membersRouter.get("/", membersController.usersListGet);

membersRouter.get("/log-in", membersController.usersLoginGet);
membersRouter.post("/log-in", membersController.usersLoginPost);

membersRouter.get("/log-out", membersController.usersLoginOut);

membersRouter.get("/create", membersController.usersCreateGet);
membersRouter.post("/create", membersController.usersCreatePost);

membersRouter.get("/secret", membersController.usersSecretGet);
membersRouter.post("/secret", membersController.usersSecretPost);

membersRouter.get("/create-message", membersController.usersCreateMessageGet);
membersRouter.post("/create-message", membersController.usersCreateMessagePost);

membersRouter.post("/delete-message", membersController.usersDeleteMessagePost);

module.exports = membersRouter;
