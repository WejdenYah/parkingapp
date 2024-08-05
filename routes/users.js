import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  countUsers,
  countUsersMonthly,
  
} from "../controllers/user.js";
import { verifyToken, verifyUser, verifyRole } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/count", countUsers);

router.get("/monthly-count", countUsersMonthly);

router.get("/checkauthentication", verifyToken, (req, res, next) => {
  res.send("hello user, you are logged in");
});

router.get("/checkuser/:id", verifyUser, (req, res, next) => {
  res.send("hello user, you are logged in and you can delete your account");
});

router.get("/checkadmin/:id", verifyRole("admin"), (req, res, next) => {
  res.send("hello admin, you are logged in and you can delete all accounts");
});

router.get("/checkproprietaireparking/:id", verifyRole("proprietaire_parking"), (req, res, next) => {
  res.send("hello proprietaire parking, you are logged in and you can consult the dashboard and see the history");
});

router.get("/checkresponsableparking/:id", verifyRole("responsable_parking"), (req, res, next) => {
  res.send("hello responsable parking, you are logged in and you can handle payments after reservation");
});

// UPDATE
router.put("/:id", updateUser);

// DELETE
router.delete("/:id", deleteUser);

// GET
router.get("/:id", verifyUser, getUser);

// GET ALL
router.get("/", getUsers);

// GET USER COUNT




export default router;
