import express from "express";
import {
  createGroup,
  getMyGroups,
  getGroupById,
  addMember,
  updateGroupPic,
} from "../controllers/group.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection, protectRoute);

router.post("/create", createGroup);
router.get("/my-groups", getMyGroups);
router.get("/:groupId", getGroupById);
router.put("/:groupId/add-member", addMember);
router.put("/:groupId/update-pic", updateGroupPic);

export default router;
