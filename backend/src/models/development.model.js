import mongoose from "mongoose";

// create the database collection (table) for a development
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
        posted: {
            type: Boolean,
            default: false
        },
        stockPriceChanges: [
            {
                stockId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Stock',
                    required: true
                },
                ticker: {
                    type: String,
                    required: true
                },
                newPrice: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ]
    },
    { timestamps: true }
);

const Development = new mongoose.model("Development", developmentSchema);
export default Development;