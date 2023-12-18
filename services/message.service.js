const jwt = require("jsonwebtoken");
const socketioJwt = require("socketio-jwt");
const { User } = require("../model/users.model");
const Conversation = require("../model/conversation.model");
const { Chat } = require("../model/chat.model");
// const socketio = require('socket.io');
const jwt_SECRET_KEY = process.env.jwt_SECRET_KEY;

// Function to create socket connection with JWT authentication
const createSocketConnection = (server) => {
  const io = require("socket.io")(server);
  // io.use(socketioJwt.authorize({
  //     secret: jwt_SECRET_KEY,
  //     handshake: true,
  // }));

  io.on("connection", async (socket) => {
    // Handle socket connection events here
    //implement disconnect function
    const handleDisconnect = (socket) => {
      socket.disconnect();
      console.log("Socket disconnected:", socket.id);
    };
    // Example: Emit a welcome message to the connected client
    socket.emit(
      "message",
      "Welcome to the socket connection! id : " + socket.id
    );
    const jwtTOken = socket.handshake.headers.authorization ?? null;
    if (!jwtTOken) {
      handleDisconnect(socket);
      return;
    }

    try {
      const decoded_token = jwt.verify(jwtTOken, jwt_SECRET_KEY);
      socket.decoded_token = decoded_token;
      /*
      {
        userId: '65808bd4caa74c074a0eba33',
        userName: 'bruce_baner',
        iat: 1702923307
    }
        */
    } catch (err) {
      console.log(err);
      handleDisconnect(socket);
      return;
    }

    const userId = socket.decoded_token.userId;
    let user = await User.findById(userId);
    if (!user) {
      handleDisconnect(socket);
      return;
    }
    user.socketId = socket.id;
    await user.save();
    socket.data.user = user;

    //on  ping from client
    socket.on("ping", () => {
      socket.emit("pong");
    });
    //send message to specific user
    socket.on("send-message", async (data) => {
      console.log(data);
      let user = socket.data.user;
      let receiver = await User.findById(data.receiverId);
      if (!receiver) {
        return;
      }

      //get conversation data if exist
      let conversation = await Conversation.findOne({
        participants: {
          $all: [user._id, data.receiverId],
        },
      });
      if (!conversation) {
        conversation = new Conversation({
          participants: [user._id, data.receiverId],
        });
        await conversation.save();
      }
      // save message to chat model with conversation id and sender id
      let chat = new Chat({
        sender: user._id,
        conversation: conversation._id,
        message: data.message,
        type: data.type,
      });
      await chat.save();
      //emit message to receiver
      io.to(receiver.socketId).emit("receive-message", chat);
    });

    //get all conversation of user
    socket.on("get-conversation", async () => {
      let user = socket.data.user;
      //get all conversation of user with last message and only 1 participant data which is not user
      let conversations = await Conversation.find({
        participants: {
          $in: [user._id],
        },
      })
        .populate({
          path: "participants",
          match: {
            _id: {
              $ne: user._id,
            },
          },
        })
        .sort({
          lastUpdated: -1,
        });

      io.to(socket.id).emit("receive-conversation", conversations);
    });

    //start call to receiver
    socket.on("start-call", async (data) => {
      let user = socket.data.user;
      let receiver = await User.findById(data.receiverId);
      if (!receiver) {
        return;
      }
      //emit call to receiver
      io.to(receiver.socketId).emit("incoming-call", {
        meetingId: data.meetingId, //room id
        callerId: user._id,
        callerName: user.userName,
        callerProfilePic: user.profilePic,
        receiverId: receiver._id,
        receiverName: receiver.userName,
      });
    });

    //accept call from caller
    socket.on("accept-call", async (data) => {
      let user = socket.data.user;
      let caller = await User.findById(data.callerId);
      if (!caller) {
        return;
      }
      //emit accept call to caller
      io.to(caller.socketId).emit("call-accepted", {
        meetingId: data.meetingId, //room id
        receiverId: user._id,
        receiverName: user.userName,
        receiverProfilePic: user.profilePic,
      });
    });

    
    //IMPLEMENT disconnect
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  //return io;
};

module.exports = createSocketConnection;
