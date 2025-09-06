import User from "../models/user.model.js";
import Stock from "../models/stock.model.js";
import Trade from "../models/trade.model.js";
import History from "../models/history.model.js";
import Market from "../models/market.model.js";

// Helper function to check if market is open
const checkMarketStatus = async () => {
    const market = await Market.findOne({});
    return market ? market.isOpen : false; // Default to closed if no market status exists
};

export const buy = async (req, res) => {
    try {
        // Check if market is open
        const isMarketOpen = await checkMarketStatus();
        if (!isMarketOpen) {
            return res.status(400).json({ message: "Market is currently closed. Trading is not available." });
        }

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
        // Check if market is open
        const isMarketOpen = await checkMarketStatus();
        if (!isMarketOpen) {
            return res.status(400).json({ message: "Market is currently closed. Trading is not available." });
        }

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

export const viewPortfolioStock = async (req, res) => {
    try {
        const traderId = req.user._id;
        const { id } = req.params; // This should be the ticker symbol

        // Find the user and get their portfolio
        const user = await User.findById(traderId).select("portfolio");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the specific stock in the portfolio by ticker
        const portfolioStock = user.portfolio.find(stock => stock.ticker === id);

        if (!portfolioStock) {
            return res.status(404).json({
                message: "Stock not found in portfolio"
            });
        }

        // Get current market data for the stock
        const currentStock = await Stock.findOne({ ticker: id });

        if (!currentStock) {
            return res.status(404).json({
                message: "Stock data not found"
            });
        }

        // Calculate current value and profit/loss
        const currentPrice = Number(currentStock.price);
        const averageBuyPrice = Number(portfolioStock.tradePrice);
        const quantity = Number(portfolioStock.amount);

        const currentValue = quantity * currentPrice;
        const totalInvested = quantity * averageBuyPrice;
        const profitLoss = currentValue - totalInvested;
        const profitLossPercentage = totalInvested > 0 ?
            ((profitLoss / totalInvested) * 100).toFixed(2) : 0;

        // Return detailed stock information
        res.status(200).json({
            stock: {
                ticker: portfolioStock.ticker,
                name: currentStock.name,
                currentPrice: currentPrice.toFixed(2),
                averageBuyPrice: averageBuyPrice.toFixed(2),
                quantity: quantity,
                totalInvested: totalInvested.toFixed(2),
                currentValue: currentValue.toFixed(2),
                profitLoss: profitLoss.toFixed(2),
                profitLossPercentage: profitLossPercentage,
                isProfit: profitLoss >= 0,
                priceChange: (currentPrice - averageBuyPrice).toFixed(2),
                priceChangePercentage: averageBuyPrice > 0 ?
                    (((currentPrice - averageBuyPrice) / averageBuyPrice) * 100).toFixed(2) : 0
            }
        });

    } catch (error) {
        console.log("Error in viewPortfolioStock controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};