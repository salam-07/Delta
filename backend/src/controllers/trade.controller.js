import User from "../models/user.model.js";
import Stock from "../models/stock.model.js";
import Trade from "../models/trades.model.js";

export const viewAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find({});
        res.status(200).json(stocks);
    } catch (error) {
        console.log("Error in viewAllStocks Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const viewStock = async (req, res) => {
    try {
        const { ticker } = req.params;
        const stockInfo = await Stock.find({ ticker: ticker });
        res.status(200).json(stockInfo);

    } catch (error) {
        console.log("Error in view Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const buy = async (req, res) => {
    return;
};

export const sell = async (req, res) => {
    return;
};