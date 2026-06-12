const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected", socket.id);

    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
    });

    socket.on("typing", (room) => {
      socket.to(room).emit("Typing");
    });

    socket.on("stop typing", (room) => {
      socket.to(room).emit("Stop Typing");
    });

    socket.on("new message", (message) => {
      console.log("bckend recieved message:", message);
      const chat = message.chat;

      if (!chat.users) return;

      chat.users.forEach((user) => {
      if (user._id.toString() === message.sender._id.toString()) return

      socket.to(user._id.toString()).emit("message received", message)
      })
    //   chat.users.forEach((userId) => {
    //     if (userId === message.sender._id) return;

    //     console.log("sending to user:", userId);

    //     socket.to(userId).emit("message received", message);
    //   });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected", socket.id);
    });
  });
};

export default socketHandler;
