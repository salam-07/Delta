import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useMarketStore } from "./useMarketStore.js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAdminStore = create((set, get) => ({
    creatingStock: false,
    updatingStock: false,

    creatingDev: false,
    updatingDev: false,
    postingDev: false,

    deletingStockId: null,
    deletingDevId: null,

    isUsersLoading: false,
    users: [],

    isTradeHistoryLoading: false,
    tradeHistory: [],


    createStock: async (data) => {
        set({ creatingStock: true });
        try {
            const res = await axiosInstance.post("/admin/createstock", data);
            toast.success("Stock Created");
            // Refresh the stocks list after creating a new stock
            useMarketStore.getState().fetchAllStocks();
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
            useMarketStore.getState().fetchAllStocks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete stock");
            console.error("Error deleting stock:", error);
        } finally {
            set({ deletingStockId: null });
        }
    },

    updateStock: async (stockId, data) => {
        set({ updatingStock: true });
        try {
            const res = await axiosInstance.put(`/admin/updatestock/${stockId}`, data);
            toast.success("Stock Price Updated");
            // Refresh the stocks list after updating stock
            useMarketStore.getState().fetchAllStocks();
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
            useMarketStore.getState().fetchAllDev();
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
            useMarketStore.getState().fetchAllDev();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete development");
            console.error("Error deleting Development:", error);
        } finally {
            set({ deletingDevId: null });
        }
    },

    updateDev: async (devId, data) => {
        set({ updatingDev: true });
        try {
            const res = await axiosInstance.put(`/admin/editdev/${devId}`, data);
            toast.success("Development Edited");
            // Refresh the development list after updating
            useMarketStore.getState().fetchAllDev();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to edit development");
            console.error("Error updating development:", error);
        } finally {
            set({ updatingDev: false });
        }
    },

    postDev: async (devId, data) => {
        set({ postingDev: true });
        try {
            const res = await axiosInstance.put(`/admin/postdev/${devId}`, data);
            toast.success("Development Status Updated");
            // Refresh the development list after updating
            useMarketStore.getState().fetchAllDev();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update development status");
            console.error("Error updating development status:", error);
        } finally {
            set({ postingDev: false });
        }
    },

    getAllUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/admin/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to get users");
            console.error("Error getting users:", error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getTradeHistory: async () => {
        set({ isTradeHistoryLoading: true });
        try {
            const res = await axiosInstance.get("/admin/tradehistory");
            set({ tradeHistory: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to get trade history");
            console.error("Error getting trade history:", error);
        } finally {
            set({ isTradeHistoryLoading: false });
        }
    },
}));