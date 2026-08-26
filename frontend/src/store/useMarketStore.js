import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useMarketStore = create((set, get) => ({
    marketOpen: false,
    isMarketStatusLoading: false,

    stocks: [],
    stock: null,
    isStocksLoading: false,
    isStockLoading: false,

    devs: [],
    dev: null,
    isDevsLoading: false,
    isDevLoading: false,

    history: [],
    isHistoryLoading: false,
    historyError: null,

    // Helper methods for Socket.IO updates
    updateStocks: (updatedStocks) => {
        set({ stocks: updatedStocks });
    },

    updateMarketStatus: (isOpen) => {
        set({ marketOpen: isOpen });
    },

    // Fetch market status from backend
    fetchMarketStatus: async () => {
        set({ isMarketStatusLoading: true });
        try {
            const res = await axiosInstance.get("/market/status");
            set({ marketOpen: res.data.isOpen });
        } catch (error) {
            toast.error("Failed to fetch market status");
            console.error("Error fetching market status:", error);
        } finally {
            set({ isMarketStatusLoading: false });
        }
    },

    // Set market status (admin only)
    setMarketStatus: async (isOpen) => {
        set({ isMarketStatusLoading: true });
        try {
            const res = await axiosInstance.put("/admin/marketstatus", { isOpen });
            set({ marketOpen: isOpen });
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change market status");
            console.error("Error setting market status:", error);
        } finally {
            set({ isMarketStatusLoading: false });
        }
    },

    // Toggle market status (admin only)
    toggleMarketStatus: async () => {
        const { marketOpen, setMarketStatus, fetchMarketStatus } = get();
        await setMarketStatus(!marketOpen);
        // Refresh the market status from backend to ensure consistency
        await fetchMarketStatus();
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

    // The chart states this failure inline, with a retry, so there is no toast:
    // a toast that vanishes leaves an empty chart with no explanation behind it.
    fetchStockHistory: async (stockId) => {
        set({ isHistoryLoading: true, historyError: null });
        try {
            const res = await axiosInstance.get(`/market/history/${stockId}`);
            set({ history: res.data });
        } catch (error) {
            set({
                history: [],
                historyError: error.response?.data?.message || "Could not load price history.",
            });
            console.error("Error fetching history:", error);
        } finally {
            set({ isHistoryLoading: false });
        }
    },

    fetchStockCompanyInfo: async (stockId) => {
        try {
            const res = await axiosInstance.get(`/market/company-info/${stockId}`);
            return res.data;
        } catch (error) {
            console.error("Error fetching company info:", error);
            return { companyInfo: "" };
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
            set({ dev: null });
            toast.error(error.response?.data?.message || "Failed to fetch development");
            console.error("Error fetching development:", error);
        } finally {
            set({ isDevLoading: false });
        }
    },

    /**
     * The admin variants of the two reads above.
     * `/market/viewdevs` and `/market/viewdev/:id` are filtered to published
     * developments — a draft carries the price changes it will trigger, so it is
     * market-moving news participants must not read early. The admin portal
     * needs drafts, so it reads from the admin routes instead.
     */
    fetchAllDevsAsAdmin: async () => {
        set({ isDevsLoading: true });
        try {
            const res = await axiosInstance.get("/admin/devs");
            set({ devs: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch developments");
            console.error("Error fetching developments:", error);
        } finally {
            set({ isDevsLoading: false });
        }
    },

    fetchDevAsAdmin: async (devId) => {
        set({ isDevLoading: true });
        try {
            const res = await axiosInstance.get(`/admin/dev/${devId}`);
            set({ dev: res.data });
        } catch (error) {
            set({ dev: null });
            toast.error(error.response?.data?.message || "Failed to fetch development");
            console.error("Error fetching development:", error);
        } finally {
            set({ isDevLoading: false });
        }
    },

}));
