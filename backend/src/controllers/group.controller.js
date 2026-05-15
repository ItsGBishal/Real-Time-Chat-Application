import Group from "../models/Group.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;
    const adminId = req.user._id;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Group name is required." });
    }

    if (!memberIds || memberIds.length < 1) {
      return res.status(400).json({ message: "Select at least one member." });
    }

    const validMembers = await User.find({ _id: { $in: memberIds } }).select("_id");
    const validMemberIds = validMembers.map((u) => u._id.toString());

    const allMembers = [...new Set([adminId.toString(), ...validMemberIds])];

    const newGroup = new Group({
      name: name.trim(),
      description: description?.trim() || "",
      admin: adminId,
      members: allMembers,
    });

    await newGroup.save();
    await newGroup.populate("members", "fullName profilePic email");
    await newGroup.populate("admin", "fullName profilePic");

    allMembers.forEach((memberId) => {
      const socketId = getReceiverSocketId(memberId);
      if (socketId) {
        io.to(socketId).emit("groupCreated", newGroup);
      }
    });

    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error in createGroup:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all groups the current user is a member of
export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ members: userId })
      .populate("members", "fullName profilePic")
      .populate("admin", "fullName profilePic")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getMyGroups:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single group by ID
export const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId)
      .populate("members", "fullName profilePic email")
      .populate("admin", "fullName profilePic");

    if (!group) return res.status(404).json({ message: "Group not found." });

    const isMember = group.members.some((m) => m._id.toString() === userId.toString());
    if (!isMember) return res.status(403).json({ message: "Access denied." });

    res.status(200).json(group);
  } catch (error) {
    console.error("Error in getGroupById:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add member to a group (admin only)
export const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId: newMemberId } = req.body;
    const adminId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found." });
    if (group.admin.toString() !== adminId.toString()) {
      return res.status(403).json({ message: "Only the group admin can add members." });
    }

    if (group.members.map((id) => id.toString()).includes(newMemberId)) {
      return res.status(400).json({ message: "User is already a member." });
    }

    group.members.push(newMemberId);
    await group.save();
    await group.populate("members", "fullName profilePic");

    const newMemberSocketId = getReceiverSocketId(newMemberId);
    if (newMemberSocketId) {
      io.to(newMemberSocketId).emit("addedToGroup", group);
    }

    res.status(200).json(group);
  } catch (error) {
    console.error("Error in addMember:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update group picture (admin only)
export const updateGroupPic = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { groupPic } = req.body;
    const adminId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found." });
    if (group.admin.toString() !== adminId.toString()) {
      return res.status(403).json({ message: "Only the group admin can update the picture." });
    }

    const uploadResponse = await cloudinary.uploader.upload(groupPic);
    group.groupPic = uploadResponse.secure_url;
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    console.error("Error in updateGroupPic:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
