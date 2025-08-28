import mongoose from "mongoose";

// create the database collection (table) for a user
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 4
        },
        role: {
            type: String,
            default: "user"
        },
        balance: {
            type: Number,
            default: "1000"
        },
        portfolio: [{
            ticker: {
                type: String,
                required: true
            },
            tradePrice: {
                type: Number,
                required: true
            },
            amount: {
                type: Number,
                required: true,
                default: 0
            }
        }]
    },
    { timestamps: true }
);

const User = new mongoose.model("User", userSchema);
export default User;