import { Router } from "express";
import {
  getUsers,
  createUser,
  loginUser,
  checkUserExists,
  updateName,
  updateProfilePhoto,
  updateBio,
  createUsers,
} from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.post("/lots", createUsers);
router.post("/check-user-exists", checkUserExists);
router.post("/login", loginUser);
router.patch("/:id/name", updateName);
router.patch("/:id/profile-photo", updateProfilePhoto);
router.patch("/:id/bio", updateBio);

export default router;
