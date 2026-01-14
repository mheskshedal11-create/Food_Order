import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    refresh_token: {
        type: String
    },
    forgot_otp: {
        type: String,
    },
    forgot_date: {
        type: Date,
    }
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
export default User;
