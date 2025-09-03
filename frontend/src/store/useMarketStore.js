import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useMarketStore = create((set, get) => ({
    marketOpen: false,
    isMarketOpening: false,

    stocks: [],
    stock: null,
    isStocksLoading: false,
    isStockLoading: false,

    devs: [],
    dev: null,
    isDevsLoading: false,
    isDevLoading: false,

    setMarketOpen: async (marketOpen) => {
        set({ isMarketOpening: true });
        try {
            set({ marketOpen });
            if (marketOpen) {
                toast.success("Market Open for Trading");
            } else {
                toast.success("Market Closed for Trading");
            }
        } catch (error) {
            toast.error("Failed to change market status");
        } finally {
            set({ isMarketOpening: false });
        }
    },

    toggleMarket: async () => {
        const { marketOpen, setMarketOpen } = get();
        await setMarketOpen(!marketOpen);
    },

    fetchAllStocks: async () => {
        set({ isStocksLoading: true });
        try {
            const res = await axiosInstance.get("/market/viewstocks");
            set({ stocks: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch stocks");
            console.error("Error fetching stocks:", error);
        } finally {
            set({ isStocksLoading: false });
        }
    },

    fetchStock: async (stockId) => {
        set({ isStockLoading: true });
        try {
            const res = await axiosInstance.get(`/market/viewstock/${stockId}`);
            set({ stock: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch stock");
            console.error("Error fetching stock:", error);
        } finally {
            set({ isStockLoading: false });
        }
    },

    fetchAllDev: async () => {
        set({ isDevsLoading: true });
        try {
            const res = await axiosInstance.get("/market/viewdevs");
            set({ devs: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch developments");
            console.error("Error fetching developments:", error);
        } finally {
            set({ isDevsLoading: false });
        }
    },

    fetchDev: async (devId) => {
        set({ isDevLoading: true });
        try {
            const res = await axiosInstance.get(`/market/viewdev/${devId}`);
            set({ dev: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch development");
            console.error("Error fetching development:", error);
        } finally {
            set({ isDevLoading: false });
        }
    },

}));
