import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAdminStore = create((set, get) => ({
    isLoading: false,
    stocks: [],
    deletingStockId: null,
    updatingStock: false,

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

    createStock: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post("/admin/create", data);
            toast.success("Stock Created");
            // Refresh the stocks list after creating a new stock
            get().fetchAllStocks();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoading: false });
        }
    },

    deleteStock: async (stockId) => {
        set({ deletingStockId: stockId });
        try {
            const res = await axiosInstance.delete(`/admin/deletestock/${stockId}`);
            toast.success("Stock Deleted Successfully");
            // Refresh the stocks list after deleting
            get().fetchAllStocks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete stock");
            console.error("Error deleting stock:", error);
        } finally {
            set({ deletingStockId: null });
        }
    },

    updateStock: async (data) => {
        set({ updatingStock: true });
        try {
            const res = await axiosInstance.put("/admin/update", data);
            toast.success("Stock Price Updated");
            // Refresh the stocks list after updating stock
            get().fetchAllStocks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update stock");
            console.error("Error updating stock:", error);
        } finally {
            set({ updatingStock: false });
        }
    },
}));