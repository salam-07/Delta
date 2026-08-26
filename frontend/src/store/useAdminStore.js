import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useMarketStore } from "./useMarketStore.js";

/** `error.response.data.message` is undefined on a network or CORS failure, and
 *  reading through it threw a second error on top of the first. */
const message = (error, fallback) => error.response?.data?.message || fallback;

/** Administrators need drafts, so mutations refresh from the admin list, not
 *  the participant-facing one (which is filtered to published developments). */
const refreshDevs = () => useMarketStore.getState().fetchAllDevsAsAdmin();
const refreshStocks = () => useMarketStore.getState().fetchAllStocks();

export const useAdminStore = create((set) => ({
    creatingStock: false,
    creatingDev: false,
    updatingDev: false,

    // Scoped to the record being changed so a table shows one busy row, not all
    // of them. `updatingStock` was a single boolean shared by every price
    // control on the page.
    updatingStockId: null,
    deletingStockId: null,
    deletingDevId: null,
    postingDevId: null,

    isUsersLoading: false,
    users: [],

    isTradeHistoryLoading: false,
    tradeHistory: [],

    isAnalyticsLoading: false,
    analytics: null,

    createStock: async (data) => {
        set({ creatingStock: true });
        try {
            await axiosInstance.post("/admin/createstock", data);
            toast.success("Stock created");
            refreshStocks();
            return true;
        } catch (error) {
            toast.error(message(error, "Failed to create stock"));
            console.error("Error creating stock:", error);
            return false;
        } finally {
            set({ creatingStock: false });
        }
    },

    deleteStock: async (stockId) => {
        set({ deletingStockId: stockId });
        try {
            await axiosInstance.delete(`/admin/deletestock/${stockId}`);
            toast.success("Stock delisted");
            refreshStocks();
            return true;
        } catch (error) {
            toast.error(message(error, "Failed to delist stock"));
            console.error("Error deleting stock:", error);
            return false;
        } finally {
            set({ deletingStockId: null });
        }
    },

    updateStock: async (stockId, data) => {
        set({ updatingStockId: stockId });
        try {
            await axiosInstance.put(`/admin/updatestock/${stockId}`, data);
            refreshStocks();
            return true;
        } catch (error) {
            toast.error(message(error, "Failed to update price"));
            console.error("Error updating stock:", error);
            return false;
        } finally {
            set({ updatingStockId: null });
        }
    },

    createDev: async (data) => {
        set({ creatingDev: true });
        try {
            await axiosInstance.post("/admin/createdev", data);
            toast.success("Development drafted");
            refreshDevs();
            return true;
        } catch (error) {
            toast.error(message(error, "Failed to create development"));
            console.error("Error creating development:", error);
            return false;
        } finally {
            set({ creatingDev: false });
        }
    },

    deleteDev: async (devId) => {
        set({ deletingDevId: devId });
        try {
            await axiosInstance.delete(`/admin/deletedev/${devId}`);
            toast.success("Development deleted");
            refreshDevs();
            return true;
        } catch (error) {
            toast.error(message(error, "Failed to delete development"));
            console.error("Error deleting development:", error);
            return false;
        } finally {
            set({ deletingDevId: null });
        }
    },

    updateDev: async (devId, data) => {
        set({ updatingDev: true });
        try {
            await axiosInstance.put(`/admin/editdev/${devId}`, data);
            toast.success("Development saved");
            refreshDevs();
            return true;
        } catch (error) {
            toast.error(message(error, "Failed to save development"));
            console.error("Error updating development:", error);
            return false;
        } finally {
            set({ updatingDev: false });
        }
    },

    /**
     * Publishing a development applies the price changes it carries, so the
     * stock list is refreshed alongside the development list.
     */
    postDev: async (devId, data) => {
        set({ postingDevId: devId });
        try {
            await axiosInstance.put(`/admin/postdev/${devId}`, data);
            toast.success(data?.status ? "Development published" : "Development withdrawn");
            refreshDevs();
            refreshStocks();
            return true;
        } catch (error) {
            toast.error(message(error, "Failed to change publish state"));
            console.error("Error updating development status:", error);
            return false;
        } finally {
            set({ postingDevId: null });
        }
    },

    getAllUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/admin/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(message(error, "Failed to load participants"));
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
            toast.error(message(error, "Failed to load trades"));
            console.error("Error getting trade history:", error);
        } finally {
            set({ isTradeHistoryLoading: false });
        }
    },

    getAnalytics: async () => {
        set({ isAnalyticsLoading: true });
        try {
            const res = await axiosInstance.get("/admin/analytics");
            set({ analytics: res.data });
        } catch (error) {
            toast.error(message(error, "Failed to load analytics"));
            console.error("Error getting analytics:", error);
        } finally {
            set({ isAnalyticsLoading: false });
        }
    },
}));
