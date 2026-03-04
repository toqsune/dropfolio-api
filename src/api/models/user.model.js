import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      match: [/^[A-Za-z][A-Za-z\s-]{1,29}$/, "Invalid name"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      select: false,
    },
    location: {
      type: String,
      trim: true,
      match: [/^[A-Za-z0-9\s-]{1,40}$/, "Invalid location"],
    },
  },
  {
    timestamps: true,
    toObject: {
      transform(doc, ret) {
        const { _id, __v, password, ...rest } = ret;

        return {
          id: _id.toString(),
          name: rest.name,
          email: rest.email,
          location: rest.location,
          createdAt: rest.createdAt,
          updatedAt: rest.updatedAt,
          ...(typeof __v !== "undefined" && { v: __v.toString() }),
        };
      },
    },
    toJSON: {
      transform(doc, ret) {
        const { _id, __v, password, ...rest } = ret;

        return {
          id: _id.toString(),
          name: rest.name,
          email: rest.email,
          location: rest.location,
          createdAt: rest.createdAt,
          updatedAt: rest.updatedAt,
          ...(typeof __v !== "undefined" && { v: __v.toString() }),
        };
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(this.password, salt);
  this.password = hashPassword;
});

userSchema.methods.verifyPassword = async function (password) {
  if (!password || !this.password) {
    return false;
  }
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
