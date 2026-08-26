import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

/**
 * Every catch here used to read `error.response.data.message` directly, which
 * itself throws when the request never reached the server — so with the backend
 * down, signing in produced no toast at all, just a spinner that stopped and an
 * unhandled rejection in the console.
 */
const authError = (error, fallback) =>
    error?.response?.data?.message ||
    (error?.response ? fallback : "Cannot reach the server. Check your connection and try again.");

export const useAuthStore = create((set) => ({
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
            set({ authUser: res.data, isAdmin: res.data?.role === "admin" });
            toast.success("Account created");
            return true;
        } catch (error) {
            toast.error(authError(error, "Could not create the account."));
            return false;
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data, isAdmin: res.data?.role === "admin" });

            // Connect to Socket.IO after successful login
            const { useSocketStore } = await import("./useSocketStore.js");
            useSocketStore.getState().connectSocket(res.data._id);

            toast.success("Signed in");
            return true;
        } catch (error) {
            toast.error(authError(error, "Could not sign in."));
            return false;
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

            toast.success("Signed out");
        } catch (error) {
            toast.error(authError(error, "Could not sign out."));
        }
    },
}));

export default useAuthStore;