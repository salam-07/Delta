import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useTradeStore = create((set, get) => ({
    // State
    balance: 0,
    portfolio: [],
    tradeHistory: [],
    portfolioStock: null,

    // Loading states
    isLoadingBalance: false,
    isLoadingPortfolio: false,
    isLoadingHistory: false,
    isLoadingPortfolioStock: false,
    isTrading: false, // For buy/sell operations

    // Trade Actions
    buyStock: async (ticker, amount) => {
        set({ isTrading: true });
        try {
            const res = await axiosInstance.post("/trade/buy", {
                ticker,
                amount: Number(amount)
            });

            toast.success(`Successfully bought ${amount} shares of ${ticker}`);

            // Refresh balance and portfolio after successful trade
            get().checkBalance();
            get().viewPortfolio();

            return res.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to buy stock";
            toast.error(errorMessage);
            console.error("Error buying stock:", error);
            throw error;
        } finally {
            set({ isTrading: false });
        }
    },

    sellStock: async (ticker, amount) => {
        set({ isTrading: true });
        try {
            const res = await axiosInstance.post("/trade/sell", {
                ticker,
                amount: Number(amount)
            });

            toast.success(`Successfully sold ${amount} shares of ${ticker}`);

            // Refresh balance and portfolio after successful trade
            get().checkBalance();
            get().viewPortfolio();

            return res.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to sell stock";
            toast.error(errorMessage);
            console.error("Error selling stock:", error);
            throw error;
        } finally {
            set({ isTrading: false });
        }
    },

    // Balance Management
    checkBalance: async () => {
        set({ isLoadingBalance: true });
        try {
            const res = await axiosInstance.get("/trade/balance");

            // The response might be an array with one object, so handle both cases
            const balanceData = Array.isArray(res.data) ? res.data[0] : res.data;
            const balance = balanceData?.balance || 0;

            set({ balance: Number(balance) });
            return balance;
        } catch (error) {
            console.error("Error fetching balance:", error);
            toast.error("Failed to fetch balance");
            return 0;
        } finally {
            set({ isLoadingBalance: false });
        }
    },

    // Portfolio Management
    viewPortfolio: async () => {
        set({ isLoadingPortfolio: true });
        try {
            const res = await axiosInstance.get("/trade/portfolio");

            // The response might be an array with one object, so handle both cases
            const portfolioData = Array.isArray(res.data) ? res.data[0] : res.data;
            const portfolio = portfolioData?.portfolio || [];

            set({ portfolio });
            return portfolio;
        } catch (error) {
            console.error("Error fetching portfolio:", error);
            toast.error("Failed to fetch portfolio");
            set({ portfolio: [] });
            return [];
        } finally {
            set({ isLoadingPortfolio: false });
        }
    },

    // Trade History
    viewHistory: async () => {
        set({ isLoadingHistory: true });
        try {
            const res = await axiosInstance.get("/trade/history");
            const tradeHistory = res.data || [];

            set({ tradeHistory });
            return tradeHistory;
        } catch (error) {
            console.error("Error fetching trade history:", error);
            toast.error("Failed to fetch trade history");
            set({ tradeHistory: [] });
            return [];
        } finally {
            set({ isLoadingHistory: false });
        }
    },

    // Portfolio Stock Details
    viewPortfolioStock: async (ticker) => {
        set({ isLoadingPortfolioStock: true, portfolioStock: null });
        try {
            const res = await axiosInstance.get(`/trade/view-portfolio-stock/${ticker}`);
            const portfolioStock = res.data?.stock || null;

            set({ portfolioStock });
            return portfolioStock;
        } catch (error) {
            console.error("Error fetching portfolio stock:", error);
            const errorMessage = error.response?.data?.message || "Failed to fetch stock details";
            toast.error(errorMessage);
            set({ portfolioStock: null });
            return null;
        } finally {
            set({ isLoadingPortfolioStock: false });
        }
    },

    // Helper Methods
    getPortfolioValue: () => {
        const { portfolio } = get();
        return portfolio.reduce((total, stock) => {
            const stockValue = (stock.amount || 0) * (stock.tradePrice || 0);
            return total + stockValue;
        }, 0);
    },

    getStockInPortfolio: (ticker) => {
        const { portfolio } = get();
        return portfolio.find(stock => stock.ticker === ticker) || null;
    },

    getTotalAssets: () => {
        const { balance } = get();
        const portfolioValue = get().getPortfolioValue();
        return balance + portfolioValue;
    },

    // Reset Methods
    resetTradeStore: () => {
        set({
            balance: 0,
            portfolio: [],
            tradeHistory: [],
            portfolioStock: null,
            isLoadingBalance: false,
            isLoadingPortfolio: false,
            isLoadingHistory: false,
            isLoadingPortfolioStock: false,
            isTrading: false
        });
    },

    // Initialize all data
    initializeTradeData: async () => {
        try {
            await Promise.all([
                get().checkBalance(),
                get().viewPortfolio(),
                get().viewHistory()
            ]);
        } catch (error) {
            console.error("Error initializing trade data:", error);
        }
    }
}));