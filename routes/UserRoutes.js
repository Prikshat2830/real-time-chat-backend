import express from "express";
import { registerUser, loginUser } from "../controllers/UserController.js";
import User from "../models/User.js";

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
// router.get("/users", async (req, res) => {
//     try {
//         const users = await User.find();
//         res.json(users);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Failed to fetch users" });
//     }
// });
router.get("/", async (req, res) => {
    const users = await User.find()
    res.json(users)
})

export default router 