import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs"


interface admin{
    _id?: ObjectId,
    username: string,
    email: string,
    password: string,
    joinedAt?: Date,
    role: "admin"
    lastPasswordReset: Date,
    loginAttempts: number,
    lockUntil: Date | null,
}

const Admin = new Schema<admin>({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        enum: ["admin"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    lastPasswordReset: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
  lockUntil: {
    type: Date
  },
    joinedAt: {
        type: Date,
        default: Date.now
    }
})


 
Admin.pre("save", async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch(error) {
        throw error;
    }
});

const Adminmodel =  model("admin", Admin)
export default Adminmodel