import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  name: {
    type: String,
    default: "",
    maxlength: 64,
    trim: true,
  },
});
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
