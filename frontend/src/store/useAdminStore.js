import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useMarketStore } from "./useMarketStore.js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

const { fetchAllStocks, fetchAllDev } = useMarketStore();

export const useAdminStore = create((set, get) => ({
    creatingStock: false,
    updatingStock: false,

    creatingDev: false,
    updatingDev: false,
    postingDev: false,

    deletingStockId: null,
    deletingDevId: null,

    createStock: async (data) => {
        set({ creatingStock: true });
        try {
            const res = await axiosInstance.post("/admin/createstock", data);
            toast.success("Stock Created");
            // Refresh the stocks list after creating a new stock
            fetchAllStocks();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ creatingStock: false });
        }
    },

    deleteStock: async (stockId) => {
        set({ deletingStockId: stockId });
        try {
            const res = await axiosInstance.delete(`/admin/deletestock/${stockId}`);
            toast.success("Stock Deleted Successfully");
            // Refresh the stocks list after deleting
            fetchAllStocks();
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
            const res = await axiosInstance.put("/admin/updatestock", data);
            toast.success("Stock Price Updated");
            // Refresh the stocks list after updating stock
            fetchAllStocks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update stock");
            console.error("Error updating stock:", error);
        } finally {
            set({ updatingStock: false });
        }
    },

    createDev: async (data) => {
        set({ creatingDev: true });
        try {
            const res = await axiosInstance.post("/admin/createdev", data);
            toast.success("Development Created");
            // Refresh the development list after creating a new stock
            fetchAllDev();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ creatingDev: false });
        }
    },

    deleteDev: async (devId) => {
        set({ deletingDevId: devId });
        try {
            const res = await axiosInstance.delete(`/admin/deletedev/${devId}`);
            toast.success("Development Deleted Successfully");
            // Refresh the Developments list after deleting
            fetchAllDev();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete development");
            console.error("Error deleting Development:", error);
        } finally {
            set({ deletingDevId: null });
        }
    },

    updateDev: async (data) => {
        set({ updatingDev: true });
        try {
            const res = await axiosInstance.put("/admin/updatedev", data);
            toast.success("Development Edited");
            // Refresh the stocks list after updating stock
            fetchAllDev();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to edit development");
            console.error("Error updating development:", error);
        } finally {
            set({ updatingDev: false });
        }
    },

    postDev: async (data) => {
        set({ postingDev: true });
        try {
            const res = await axiosInstance.put("/admin/postdev", data);
            toast.success("Development Edited");
            // Refresh the stocks list after updating stock
            fetchAllDev();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to edit development");
            console.error("Error updating development:", error);
        } finally {
            set({ postingDev: false });
        }
    },
}));