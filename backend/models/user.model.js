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
    forgot_otp: {
        type: String,
    },
    forgot_date: {
        type: Date,
    },
    addresses: [
        {
            state: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true

            },
            postalCode: {
                type: String,
                required: true

            },
            location: {
                type: {
                    type: String,
                    enum: ["Point"],
                    default: "Point"

                },
                coordinates: {
                    type: [Number],
                    required: true

                }, // [lng, lat]
            },
            placeName: {
                type: String
            }, // <-- store place name from reverse geocoding
        },
    ],
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
export default User;
