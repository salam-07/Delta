import Stock from "../models/stock.model.js";
import History from "../models/history.model.js";
import Development from "../models/development.model.js";
import Market from "../models/market.model.js";


export const viewAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find({}); // select all that are not index
        res.status(200).json(stocks);
    } catch (error) {
        console.log("Error in viewAllStocks Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const viewStock = async (req, res) => {
    try {
        const { id } = req.params;
        const stockInfo = await Stock.findById(id);
        res.status(200).json(stockInfo);
    } catch (error) {
        console.log("Error in viewStock Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const viewStockHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const history = await History.find({ stockId: id });

        if (!history) {
            return res.status(404).json({ message: "History not found" });
        }

        res.status(200).json(history);
    } catch (error) {
        console.log("Error in viewStockHistory controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const viewAllDevelopments = async (req, res) => {
    try {
        const devs = await Development.find({}).sort({ createdAt: -1 });
        if (!devs) {
            return res.status(404).json({ message: "No Developments Found" });
        }
        res.status(200).json(devs);
    } catch (error) {
        console.log("Error in viewAllDevelopments Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const viewDevelopment = async (req, res) => {
    try {
        const { id } = req.params;
        const dev = await Development.findById(id);
        res.status(200).json(dev);

    } catch (error) {
        console.log("Error in viewDevelopment Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMarketStatus = async (req, res) => {
    try {
        let market = await Market.findOne({});

        if (!market) {
            // If no market status exists, create one with default closed status
            market = new Market({ isOpen: false });
            await market.save();
        }

        res.status(200).json({
            isOpen: market.isOpen
        });

    } catch (error) {
        console.log("Error in getMarketStatus controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};