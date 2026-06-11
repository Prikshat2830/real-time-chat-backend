import Chat from "../models/Chat.js";
import User from "../models/User.js";

export const createChat = async (req, res) => {
  if (req.body.name && req.body.users) {
    let users;

    try {
      users = JSON.parse(req.body.users);
    } catch (err) {
      return res.status(400).json({ message: "Invalid users format" });
    }

    if (users.length < 1) {
      return res.status(400).json({ message: "Select at least 1 user" });
    }

    users.push(req.user._id);

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(fullGroupChat);
  }
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "UserId required" });
  }

  try {
    let chat = await Chat.find({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    }).populate("users", "-password");

    if (chat.length > 0) {
      return res.json(chat[0]);
    }

    const otherUser = await User.findById(userId);

    const newChat = await Chat.create({
      chatName: otherUser.name,
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(newChat._id).populate(
      "users",
      "-password",
    );

    res.status(201).json(fullChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createGroupChat = async (req, res) => {
  try {
    const { name, users } = req.body;
    let parsedUsers;

    try {
      parsedUsers = JSON.parse(users);
    } catch {
      return res.status(400).json({ message: "Users must be array" });
    }

    if (!name || !parsedUsers || parsedUsers.length < 1) {
      return res.status(400).json({ message: "Invalid group data" });
    }

    const groupChat = await Chat.create({
      chatName: name,
      users: [...parsedUsers, req.user._id],
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroup = await Chat.findById(groupChat._id).populate(
      "users",
      "-password",
    );

    res.status(201).json(fullGroup);
  } catch (error) {
    console.error("GROUP CHAT ERROR:", error.message); // 👈 ADD THIS
    res.status(500).json({ message: error.message });
  }
};
