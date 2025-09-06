import mongoose from "mongoose";

// create the database collection (table) for a stock
const marketSchema = new mongoose.Schema(
    {
        isOpen: {
            type: Boolean,
            default: false
        },
    }
);

const Market = new mongoose.model("Market", marketSchema);
export default Market;