import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { encrypt, decrypt } from "../lib/encryption.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

function decryptMessage(msg) {
  const plain = msg.toObject ? msg.toObject() : { ...msg };
  if (plain.text) plain.text = decrypt(plain.text);
  return plain;
}

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      groupId: null,
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    const decryptedMessages = messages.map(decryptMessage);

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const encryptedText = text ? encrypt(text) : undefined;

    const newMessage = new Message({
      senderId,
      receiverId,
      groupId: null,
      text: encryptedText,
      image: imageUrl,
    });

    await newMessage.save();

    const payload = decryptMessage(newMessage);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", payload);
    }

    res.status(201).json(payload);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      groupId: null,
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");
    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const myId = req.user._id;
    const { senderId } = req.params;

    const result = await Message.updateMany(
      {
        senderId,
        receiverId: myId,
        isRead: false,
        groupId: null,
      },
      {
        $set: { isRead: true, readAt: new Date() },
      }
    );

    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId && result.modifiedCount > 0) {
      io.to(senderSocketId).emit("messagesRead", {
        readBy: myId.toString(),
        senderId: senderId,
      });
    }

    res.status(200).json({ message: "Messages marked as read", count: result.modifiedCount });
  } catch (error) {
    console.error("Error in markMessagesAsRead:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await Message.find({ groupId }).populate("senderId", "fullName profilePic");

    const decryptedMessages = messages.map((msg) => {
      const plain = msg.toObject();
      if (plain.text) plain.text = decrypt(plain.text);
      return plain;
    });

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.error("Error in getGroupMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { groupId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const encryptedText = text ? encrypt(text) : undefined;

    const newMessage = new Message({
      senderId,
      groupId,
      receiverId: null,
      text: encryptedText,
      image: imageUrl,
    });

    await newMessage.save();
    await newMessage.populate("senderId", "fullName profilePic");

    const payload = {
      ...newMessage.toObject(),
      text: text || undefined,
    };

    io.to(`group:${groupId}`).emit("newGroupMessage", payload);

    res.status(201).json(payload);
  } catch (error) {
    console.error("Error in sendGroupMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
