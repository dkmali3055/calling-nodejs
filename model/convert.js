const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: { type: String, select: false },
    friendRequestCreator: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FriendRequest' }],
    friendRequestReceiver: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FriendRequest' }],
    conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

const friendRequestSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const conversationSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    lastUpdated: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
    message: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { User, FriendRequest, Conversation, Message };
