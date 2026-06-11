import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400).json({ message: "Invalid data" });
    }

    try {
        let message = await Message.create({
            sender: req.user._id,
            content,
            chat: chatId,
        });

        message = await message.populate("sender", "name email");
message = await message.populate("chat");

message = await User.populate(message, {
    path: "chat.users",
    select: "name email",
});

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message,
        });

        res.json(message);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const fetchMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            chat: req.params.chatId,
        }).populate("sender", "name email");

        res.json(messages);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};