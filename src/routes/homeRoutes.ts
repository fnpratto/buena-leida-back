import { Router } from "express";
import {
  getTop6Books,
} from "../controllers/bookController";

import {get6UserProfile} from "../controllers/userController"
import{getRandomGroups} from "../controllers/groupController"

const router = Router();

router.get("/topbooks",getTop6Books)
router.get("/topusers",get6UserProfile)
router.get("/topgroups",getRandomGroups)

export default router;
