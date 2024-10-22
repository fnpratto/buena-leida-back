import { Router } from "express";
import {
  getUsers,
  createUser,
  loginUser,
  checkUserExists,
} from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.post("/check-user-exists", checkUserExists);
router.post("/login", loginUser);

export default router;
