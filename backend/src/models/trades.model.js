import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
    traderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    stockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
        required: true,
    },
    amount: {
        type: Number,
    },
    type: {
        type: String,
    },
    tradePrice: {
        type: Number,
    },
    total: {
        type: Number,
    }
},
    { timestamps: true }
);

const Trade = mongoose.model("Trade", tradeSchema);

export default Trade;