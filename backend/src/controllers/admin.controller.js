import Stock from "../models/stock.model.js";
import User from "../models/user.model.js";
import Development from "../models/development.model.js";
import History from "../models/history.model.js";

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

        const newHistory = new History(
            {
                stockId: newStock._id,
                price: price
            }
        );

        if (newStock) {
            await newStock.save();
            await newHistory.save();
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
        const newHistory = new History(
            {
                stockId: updatedStock._id,
                price: newPrice,
            }
        );
        await newHistory.save();
        res.status(200).json(updatedStock);

    } catch (error) {
        console.log("error in updatePrice", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const newDevelopment = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "All fields required" });
        }

        // check if stock ticker already exists
        const development = await Development.findOne({ title });

        // if stock already exists, then show message
        if (development) return res.status(400).json({ message: "Development already exists" });

        // create new stock
        const newDev = new Development(
            {
                title: title,
                content: content,
            }
        );

        if (newDev) {
            await newDev.save();
            res.status(201).json({
                _id: newDev._id,
                title: newDev.title,
                content: newDev.content,
            });
        }
    } catch (error) {
        console.log("error in newDevelopment", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const editDevelopment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const updatedDev = await Development.findByIdAndUpdate(id, { content: content }, { new: true });
        if (!updatedDev) return res.status(404).json({ message: "Development not found" });
        res.status(200).json(updatedDev);

    } catch (error) {
        console.log("error in editDevelopment", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteDevelopment = async (req, res) => {
    try {
        const { title, content } = req.body;
        const deletedDev = await Development.findByIdAndDelete(req.params.id);
        if (!deletedDev) return res.status(404).json({ message: "Development not found" });

        res.status(200).json({ message: "Development Deleted!" });
    } catch (error) {
        console.error("Error in deleteDevelopment controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteStock = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStock = await Stock.findByIdAndDelete(id);
        if (!deletedStock) return res.status(404).json({ message: "Stock not found" });

        res.status(200).json({ message: "Stock Deleted!" });
    } catch (error) {
        console.error("Error in deleteStock controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};