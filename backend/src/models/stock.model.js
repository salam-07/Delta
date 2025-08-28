import mongoose from "mongoose";

// create the database collection (table) for a user
const stockSchema = new mongoose.Schema(
    {
        ticker: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Stock = new mongoose.model("Stock", stockSchema);
export default Stock;