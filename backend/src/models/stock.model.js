import mongoose from "mongoose";

// create the database collection (table) for a stock
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
        openingPrice: {
            type: Number,
        },
        price: {
            type: Number,
            required: true,
        },
        companyInfo: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Stock = new mongoose.model("Stock", stockSchema);
export default Stock;