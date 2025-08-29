import mongoose from "mongoose";

// create the database collection (table) for a stock
const developmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Development = new mongoose.model("Development", developmentSchema);
export default Development;