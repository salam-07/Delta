import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useTradeStore = create((set, get) => ({
    isLoading: false,
    stocks: [],

    fetchAllStocks: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/trade/view");
            set({ stocks: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch stocks");
            console.error("Error fetching stocks:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    seeChange: async (stockId) => {
        try {
            const res = await axiosInstance.get(`/trade/change/${stockId}`);
            return res.data;
        } catch (error) {
            console.error("Error fetching stock change:", error);
            toast.error(error.response?.data?.message || "Failed to fetch stock change");
            throw error;
        }
    },

    priceHistory: async (stockId) => {
        try {
            const res = await axiosInstance.get(`/history/${stockId}`);
            return res.data;
        } catch (error) {
            console.error("Error fetching stock price history:", error);
            toast.error(error.response?.data?.message || "Failed to fetch price history");
            throw error;
        }
    }
}));