import Stock from "../models/stock.model.js";
import User from "../models/user.model.js";

export const createStock = async (req, res) => {

    const { ticker, name, price } = req.body; // takes ticker, name, price
    try {
        // validation checks

        // if any field empty
        if (!ticker || !name || !price) {
            return res.status(400).json({ message: "All fields required" });
        }

        // check if stock ticker already exists
        const stock = await Stock.findOne({ ticker });

        // if stock already exists, then show message
        if (stock) return res.status(400).json({ message: "Stock already exists" });

        // create new stock
        const newStock = new Stock(
            {
                ticker: ticker,
                name: name,
                price: price,
            }
        );

        if (newStock) {
            await newStock.save();
            res.status(201).json({
                _id: newStock._id,
                ticker: newStock.ticker,
                name: newStock.name,
                price: newStock.price,
            });

        } else {
            res.status(400).json({ message: "Invalid Stock Data" });
        }

    } catch (error) {
        console.log("Error in createStock controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const showUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "admin" } }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in showUsers controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updatePrice = async (req, res) => {
    try {
        const { newPrice, ticker } = req.body;

        if (!newPrice || !ticker) {
            return res.status(404).json({ message: "All fields required" });
        }

        const updatedStock = await Stock.findOneAndUpdate({ ticker: ticker }, { price: newPrice }, { new: true });
        res.status(200).json(updatedStock);

    } catch (error) {
        console.log("error in updatePrice", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};