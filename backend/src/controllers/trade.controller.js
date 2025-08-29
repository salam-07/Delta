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
    try {
        const { ticker, amount } = req.body;
        const traderId = req.user._id;
        // Get the stock document
        const stock = await Stock.findOne({ ticker: ticker });

        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }
        const stockId = stock._id;
        const tradePrice = Number(stock.price);
        const tradeAmount = Number(amount);

        if (isNaN(tradeAmount) || tradeAmount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }
        const total = tradePrice * tradeAmount;

        // Fetch the user's current balance from the database
        const user = await User.findById(traderId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newBalance = Number(user.balance) - total;
        if (isNaN(newBalance) || newBalance < 0) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Update user's portfolio
        const existingStock = user.portfolio.find(item => item.ticker === ticker);
        if (existingStock) {
            // If stock already exists, update the amount price
            const totalAmount = existingStock.amount + tradeAmount;

            existingStock.amount = totalAmount;
            existingStock.tradePrice = tradePrice;
        } else {
            // Add new stock to portfolio
            user.portfolio.push({
                ticker: ticker,
                tradePrice: tradePrice,
                amount: tradeAmount
            });
        }

        // add to trade history
        const newTrade = new Trade({
            traderId,
            stockId,
            amount: tradeAmount,
            type: "buy",
            tradePrice: tradePrice,
            total: total,
        });

        await newTrade.save();
        await User.findByIdAndUpdate(traderId, {
            balance: newBalance,
            portfolio: user.portfolio
        });

        res.status(201).json(newTrade);

    } catch (error) {
        console.log("Error in buy controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const sell = async (req, res) => {
    try {
        const { ticker, amount } = req.body;
        const traderId = req.user._id;
        // Get the stock document
        const stock = await Stock.findOne({ ticker: ticker });
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }
        const stockId = stock._id;
        const tradePrice = Number(stock.price);
        const tradeAmount = Number(amount);
        if (isNaN(tradeAmount) || tradeAmount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }
        const total = tradePrice * tradeAmount;


        // Fetch the user's current balance from the database
        const user = await User.findById(traderId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user has enough stocks to sell
        const existingStock = user.portfolio.find(item => item.ticker === ticker);
        if (!existingStock || existingStock.amount < tradeAmount) {
            return res.status(400).json({ message: "Insufficient stocks to sell" });
        }

        const newBalance = Number(user.balance) + total;

        // Update user's portfolio
        existingStock.amount -= tradeAmount;

        // Remove stock from portfolio if amount becomes 0
        if (existingStock.amount === 0) {
            user.portfolio = user.portfolio.filter(item => item.ticker !== ticker);
        }

        const newTrade = new Trade({
            traderId,
            stockId,
            amount: tradeAmount,
            type: "sell",
            tradePrice: tradePrice,
            total: total,
        });

        await newTrade.save();
        await User.findByIdAndUpdate(traderId, {
            balance: newBalance,
            portfolio: user.portfolio
        });

        res.status(201).json(newTrade);

    } catch (error) {
        console.log("Error in sell controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkBalance = async (req, res) => {
    try {
        const traderId = req.user._id;
        const balance = await User.find(traderId).select("balance");

        res.status(200).json(balance);
    } catch (error) {
        console.log("Error in checkBalance controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const viewPortfolio = async (req, res) => {
    try {
        const traderId = req.user._id;
        const portfolio = await User.find(traderId).select("portfolio");
        res.status(200).json(portfolio);
    } catch (error) {
        console.log("Error in viewPortfolio controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const viewHistory = async (req, res) => {
    try {
        const traderId = req.user._id;
        const history = await Trade.find({ traderId: traderId });
        res.status(200).json(history);
    } catch (error) {
        console.log("Error in viewHistory controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};