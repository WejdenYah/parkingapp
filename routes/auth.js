import express from "express";
import { login, loginProprietere, register, registerProprietere, resetPassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/register",register)
router.post("/login",login)
router.post("/reset-password",resetPassword)
router.post("/proprietere/register",registerProprietere)
router.post("/login/proprietere",loginProprietere)

export default router 