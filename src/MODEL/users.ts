import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

interface users {
    _id?: ObjectId,
    waitlistId: Number,
    name: string,
    email: string,
    joinedAt?: Date
}

const userschema = new Schema<users>({
  waitlistId: {
    type: Number
  },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
})

const Usermodel = model<users>("users", userschema)

export default Usermodel