import express from "express";
import { Register, Login, logout } from "../controllers/UsersController.js";
import { verifyToken } from "../middleware/Verifytoken.js";
import { getAccessToken } from "../controllers/TokenController.js";

const router = express.Router();

router.get("/token", getAccessToken);

// User Routes
router.post("/register", Register);
router.post("/login", Login);
router.delete("/logout", logout);


router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
