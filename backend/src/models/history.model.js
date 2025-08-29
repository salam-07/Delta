import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    stockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
        required: true,
    },
    price: {
        type: Number,
    }
},
    { timestamps: true }
);

const History = mongoose.model("History", historySchema);

export default History;