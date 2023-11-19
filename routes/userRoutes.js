const { getAllUsers, createUser, updateUser, getUser, deleteUser } = require("../controllers/users");

const userRouter = require("express").Router();

userRouter.route("/").get(getAllUsers).post(createUser);

userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;