import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
  },
  email : {
    type : String,
    required : true,
  },
  password : {
    type : String,
    required : true,
  },
  role : {
    type : String,
    enum : ["instructor", "student"],
    default : "student"
  },
  enrolledCourses : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Course'
    }
  ],
  photoUrl : {
    type : String,
    default : ""
  }

}, {timestamps : true})


// Hash the password before saving
userSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
      const encryptedPass = await bcrypt.hash(this.password, 10);
      this.password = encryptedPass;
      next();
    }
})

userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
}

// jwt is "Bearer" token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email : this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
  );
}

export const User = mongoose.model("User", userSchema);