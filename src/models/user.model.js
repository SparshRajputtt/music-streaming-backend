import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "artist"], default: "user" },
  recentlyPlayed: [
    { type: mongoose.Schema.Types.ObjectId,
      ref: 'music'
    }
  ],
  likedSongs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'music'
    }
  ]
});

const userModel = mongoose.model('user', userSchema);

export default userModel;
