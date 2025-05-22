import express from "express";
import { Register, Login, logout, getProfilePicture, updateProfilePicture } from "../controllers/UsersController.js";
import { verifyToken } from "../middleware/Verifytoken.js";
import { getAccessToken } from "../controllers/TokenController.js";
import { getAllTask, addTask, updateTask, deleteTask } from "../controllers/TasksController.js";
import { getAllLogs, addLogs, updateLogs, deleteLogs } from "../controllers/LogsController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/token", getAccessToken);

// User Routes
router.get("/get-profile", verifyToken, getProfilePicture);
router.post("/update-profile", verifyToken, upload.single("picture"), updateProfilePicture);
router.post("/register", Register);
router.post("/login", Login);
router.delete("/logout", logout);

// Task Routes
router.get("/get-all-task", verifyToken, getAllTask);
router.post("/add-task", verifyToken, addTask);
router.post("/update-task", verifyToken, updateTask);
router.delete("/delete-task", verifyToken, deleteTask);

// Log Routes
router.get("/get-all-log", verifyToken, getAllLogs);
router.post("/add-log", verifyToken, addLogs);
router.post("/update-log", verifyToken, updateLogs);
router.delete("/delete-log", verifyToken, deleteLogs);

router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
