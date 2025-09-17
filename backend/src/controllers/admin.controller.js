import Stock from "../models/stock.model.js";
import User from "../models/user.model.js";
import Development from "../models/development.model.js";
import History from "../models/history.model.js";
import Trade from "../models/trade.model.js";
import Market from "../models/market.model.js";
import { emitToAll } from "../lib/socket.js";

export const createStock = async (req, res) => {

    const { ticker, name, price } = req.body; // takes ticker, name, price
    try {
        // validation checks

        // if any field empty
        if (!ticker || !name || !price) {
            return res.status(400).json({ message: "All fields required" });
        }

        // check if stock ticker already exists
        const stock = await Stock.findOne({ ticker }).lean();

        // if stock already exists, then show message
        if (stock) return res.status(400).json({ message: "Stock already exists" });

        // create new stock
        const newStock = new Stock(
            {
                ticker: ticker,
                name: name,
                openingPrice: price,
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

export const updatePrice = async (req, res) => {
    try {
        const { newPrice } = req.body;
        const { id } = req.params;
        if (!newPrice) {
            return res.status(404).json({ message: "All fields required" });
        }

        const updatedStock = await Stock.findByIdAndUpdate(id, { price: newPrice }, { new: true });
        const newHistory = new History(
            {
                stockId: updatedStock._id,
                price: newPrice,
            }
        );
        await newHistory.save();

        // Emit real-time stock price update to all connected clients
        emitToAll("stockPriceUpdated", {
            stockId: updatedStock._id,
            ticker: updatedStock.ticker,
            name: updatedStock.name,
            price: updatedStock.price,
            openingPrice: updatedStock.openingPrice
        });

        res.status(200).json(updatedStock);

    } catch (error) {
        console.log("error in updatePrice", error);
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

export const newDevelopment = async (req, res) => {
    try {
        const { title, content, stockPriceChanges = [] } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        // check if development already exists
        const development = await Development.findOne({ title }).lean();

        // if development already exists, then show message
        if (development) return res.status(400).json({ message: "Development already exists" });

        // Validate stock price changes if provided
        if (stockPriceChanges.length > 0) {
            for (const change of stockPriceChanges) {
                if (!change.stockId || !change.ticker || change.newPrice < 0) {
                    return res.status(400).json({
                        message: "Invalid stock price change data. All fields are required and price must be non-negative."
                    });
                }

                // Verify stock exists
                const stock = await Stock.findById(change.stockId).lean();
                if (!stock) {
                    return res.status(404).json({
                        message: `Stock with ID ${change.stockId} not found`
                    });
                }
            }
        }

        // create new development
        const newDev = new Development({
            title: title,
            content: content,
            stockPriceChanges: stockPriceChanges
        });

        if (newDev) {
            await newDev.save();
            res.status(201).json({
                _id: newDev._id,
                title: newDev.title,
                content: newDev.content,
                stockPriceChanges: newDev.stockPriceChanges,
                posted: newDev.posted
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
        const { title, content, stockPriceChanges = [] } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        // Validate stock price changes if provided
        if (stockPriceChanges.length > 0) {
            for (const change of stockPriceChanges) {
                if (!change.stockId || !change.ticker || change.newPrice < 0) {
                    return res.status(400).json({
                        message: "Invalid stock price change data. All fields are required and price must be non-negative."
                    });
                }

                // Verify stock exists
                const stock = await Stock.findById(change.stockId).lean();
                if (!stock) {
                    return res.status(404).json({
                        message: `Stock with ID ${change.stockId} not found`
                    });
                }
            }
        }

        const updateData = {
            content: content,
            stockPriceChanges: stockPriceChanges
        };

        // Only update title if provided and different
        if (title) {
            // Check if title already exists for another development
            const existingDev = await Development.findOne({
                title: title,
                _id: { $ne: id }
            }).lean();

            if (existingDev) {
                return res.status(400).json({ message: "Development with this title already exists" });
            }

            updateData.title = title;
        }

        const updatedDev = await Development.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedDev) return res.status(404).json({ message: "Development not found" });
        res.status(200).json(updatedDev);

    } catch (error) {
        console.log("error in editDevelopment", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteDevelopment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDev = await Development.findByIdAndDelete(id);
        if (!deletedDev) return res.status(404).json({ message: "Development not found" });

        res.status(200).json({ message: "Development deleted successfully!" });
    } catch (error) {
        console.error("Error in deleteDevelopment controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const postDevelopment = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Get the development first to access stock price changes
        const development = await Development.findById(id);
        if (!development) return res.status(404).json({ message: "Development not found" });

        // If posting the development (status = true) and there are stock price changes
        if (status === true && development.stockPriceChanges && development.stockPriceChanges.length > 0) {
            // Apply stock price changes
            for (const change of development.stockPriceChanges) {
                try {
                    // Update stock price
                    const updatedStock = await Stock.findByIdAndUpdate(
                        change.stockId,
                        { price: change.newPrice },
                        { new: true }
                    );

                    if (updatedStock) {
                        // Create history entry
                        const newHistory = new History({
                            stockId: updatedStock._id,
                            price: change.newPrice,
                        });
                        await newHistory.save();

                        // Emit real-time stock price update to all connected clients
                        emitToAll("stockPriceUpdated", {
                            stockId: updatedStock._id,
                            ticker: updatedStock.ticker,
                            name: updatedStock.name,
                            price: updatedStock.price,
                            openingPrice: updatedStock.openingPrice
                        });
                    }
                } catch (stockUpdateError) {
                    console.log(`Error updating stock ${change.ticker}:`, stockUpdateError);
                    // Continue with other stocks even if one fails
                }
            }
        }

        // Update development status
        const updatedDev = await Development.findByIdAndUpdate(id, { posted: status }, { new: true });
        if (!updatedDev) return res.status(404).json({ message: "Development not found" });

        res.status(200).json({
            ...updatedDev.toObject(),
            message: status ? "Development posted and stock prices updated successfully!" : "Development status updated successfully!"
        });

    } catch (error) {
        console.log("error in postDevelopment", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const showUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "admin" } }).select("-password").lean();
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in showUsers controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const showTradingHistory = async (req, res) => {
    try {
        const history = await Trade.find({})
            .populate('traderId', 'fullName name email')
            .populate('stockId', 'ticker name')
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json(history);

    } catch (error) {
        console.log("Error in showTradingHistory controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const setMarketStatus = async (req, res) => {
    try {
        const { isOpen } = req.body;

        if (typeof isOpen !== 'boolean') {
            return res.status(400).json({ message: "isOpen must be a boolean value" });
        }

        // Find existing market status or create new one
        let market = await Market.findOne({}).lean();

        if (market) {
            market = await Market.findOneAndUpdate({}, { isOpen }, { new: true });
        } else {
            // Create new market status if none exists
            market = new Market({ isOpen });
            await market.save();
        }

        // Emit real-time market status update to all connected clients
        emitToAll("marketStatusChanged", {
            isOpen: market.isOpen,
            message: `Market ${isOpen ? 'opened' : 'closed'}`
        });

        res.status(200).json({
            message: `Market ${isOpen ? 'opened' : 'closed'} successfully`,
            isOpen: market.isOpen
        });

    } catch (error) {
        console.log("Error in setMarketStatus controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        // === USER ANALYTICS ===
        const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });

        // User balances and portfolio analytics
        const users = await User.find({ role: { $ne: "admin" } }).lean();
        const totalCashBalance = users.reduce((sum, user) => sum + (user.balance || 0), 0);
        const usersWithPortfolio = users.filter(user => user.portfolio && user.portfolio.length > 0).length;

        // === STOCK ANALYTICS ===
        const totalStocks = await Stock.countDocuments({});
        const stocks = await Stock.find({}).lean();
        const stocksWithPriceIncrease = stocks.filter(stock =>
            stock.price > stock.openingPrice
        ).length;
        const stocksWithPriceDecrease = stocks.filter(stock =>
            stock.price < stock.openingPrice
        ).length;

        // === TRADING ANALYTICS ===
        const totalTrades = await Trade.countDocuments({});

        // Trade volume analytics
        const allTrades = await Trade.find({}).lean();
        const totalTradeVolume = allTrades.reduce((sum, trade) =>
            sum + ((trade.tradePrice || 0) * (trade.amount || 0)), 0
        );
        const buyTrades = allTrades.filter(trade => trade.type === 'buy').length;
        const sellTrades = allTrades.filter(trade => trade.type === 'sell').length;

        // Calculate average trade size
        const averageTradeSize = totalTrades > 0 ? (totalTradeVolume / totalTrades) : 0;

        // === MARKET ANALYTICS ===
        const marketStatus = await Market.findOne({}).lean();
        const isMarketOpen = marketStatus ? marketStatus.isOpen : false;

        // === DEVELOPMENT ANALYTICS ===
        const totalDevelopments = await Development.countDocuments({});
        const publishedDevelopments = await Development.countDocuments({ posted: true });
        const draftDevelopments = await Development.countDocuments({ posted: false });

        // === PORTFOLIO ANALYTICS ===
        let totalPortfolioValue = 0;
        let totalInvestedUsers = 0;
        let mostHeldStock = { ticker: 'N/A', count: 0 };
        const stockHoldings = {};

        for (const user of users) {
            if (user.portfolio && user.portfolio.length > 0) {
                totalInvestedUsers++;

                for (const holding of user.portfolio) {
                    const stock = stocks.find(s => s.ticker === holding.ticker);
                    if (stock) {
                        const currentValue = stock.price * holding.amount;
                        totalPortfolioValue += currentValue;

                        // Track stock popularity
                        stockHoldings[holding.ticker] = (stockHoldings[holding.ticker] || 0) + 1;
                    }
                }
            }
        }

        // Find most held stock
        if (Object.keys(stockHoldings).length > 0) {
            const mostHeld = Object.entries(stockHoldings).reduce((a, b) =>
                stockHoldings[a[0]] > stockHoldings[b[0]] ? a : b
            );
            mostHeldStock = { ticker: mostHeld[0], count: mostHeld[1] };
        }

        // Calculate trading activity rate
        const tradingActivityRate = totalUsers > 0 ? ((totalInvestedUsers / totalUsers) * 100) : 0;

        // === RECENT ACTIVITY ===
        const recentTrades = await Trade.find({})
            .populate('traderId', 'fullName')
            .populate('stockId', 'ticker')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // === TOP PERFORMING STOCKS ===
        const topPerformingStocks = stocks
            .map(stock => ({
                ticker: stock.ticker,
                name: stock.name,
                currentPrice: stock.price,
                openingPrice: stock.openingPrice,
                change: stock.price - stock.openingPrice,
                changePercent: stock.openingPrice > 0 ?
                    (((stock.price - stock.openingPrice) / stock.openingPrice) * 100) : 0
            }))
            .sort((a, b) => b.changePercent - a.changePercent)
            .slice(0, 5);

        // Compile comprehensive analytics response
        const analytics = {
            overview: {
                totalUsers,
                totalStocks,
                totalTrades,
                totalTradeVolume,
                totalCashBalance,
                totalPortfolioValue,
                totalAssets: totalCashBalance + totalPortfolioValue,
                marketOpen: isMarketOpen
            },
            userMetrics: {
                totalUsers,
                usersWithPortfolio,
                totalInvestedUsers,
                tradingActivityRate: parseFloat(tradingActivityRate.toFixed(2)),
            },
            tradingMetrics: {
                totalTrades,
                buyTrades,
                sellTrades,
                totalTradeVolume,
                averageTradeSize: parseFloat(averageTradeSize.toFixed(2))
            },
            stockMetrics: {
                totalStocks,
                stocksWithPriceIncrease,
                stocksWithPriceDecrease,
                mostHeldStock,
                topPerformingStocks
            },
            contentMetrics: {
                totalDevelopments,
                publishedDevelopments,
                draftDevelopments
            },
            recentActivity: {
                recentTrades: recentTrades.map(trade => ({
                    traderName: trade.traderId?.fullName || 'Unknown',
                    stockTicker: trade.stockId?.ticker || 'Unknown',
                    type: trade.type,
                    amount: trade.amount,
                    price: trade.tradePrice,
                    date: trade.createdAt
                }))
            },
            systemHealth: {
                marketOpen: isMarketOpen,
                totalSystemValue: totalCashBalance + totalPortfolioValue,
                activeUsersPercentage: parseFloat(tradingActivityRate.toFixed(2)),
            }
        };

        res.status(200).json(analytics);

    } catch (error) {
        console.log("Error in getAnalytics controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};