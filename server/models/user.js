import mongoose from "mongoose";
import { configureJSON } from "../utils/utils.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    passwordHash: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

configureJSON(userSchema);

const User = mongoose.model("User", userSchema);

export default User;
