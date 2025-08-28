import Stock from "../models/stock.model.js";

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