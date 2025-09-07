import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isAdmin: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            // Check if user is admin based on role
            set({ isAdmin: res.data?.role === "admin" });

            // Connect to Socket.IO after successful auth
            const { useSocketStore } = await import("./useSocketStore.js");
            useSocketStore.getState().connectSocket(res.data._id);
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({ authUser: null, isAdmin: false });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    checkAdmin: async () => {
        try {
            const res = await axiosInstance.get("/auth/admin");
            set({ authUser: res.data });
            set({ isAdmin: res.data?.role === "admin" });
        } catch (error) {
            console.log("Error in checkAdmin", error);
            set({ authUser: null, isAdmin: false });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            // Set admin status based on role
            set({ isAdmin: res.data?.role === "admin" });
            toast.success("Account Created");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            // Set admin status based on role
            set({ isAdmin: res.data?.role === "admin" });

            // Connect to Socket.IO after successful login
            const { useSocketStore } = await import("./useSocketStore.js");
            useSocketStore.getState().connectSocket(res.data._id);

            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null, isAdmin: false });

            // Disconnect Socket.IO on logout
            const { useSocketStore } = await import("./useSocketStore.js");
            useSocketStore.getState().disconnectSocket();

            toast.success("Logged out succesfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
}));

export default useAuthStore;