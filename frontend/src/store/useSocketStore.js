import { create } from "zustand";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useSocketStore = create((set, get) => ({
    socket: null,
    onlineUsers: [],
    isConnected: false,

    // Connect to socket
    connectSocket: (userId) => {
        if (!userId || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: { userId }
        });

        socket.on("connect", () => {
            console.log("Connected to server");
            set({ isConnected: true });
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
            set({ isConnected: false });
        });

        // Listen for online users updates
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

        // Listen for stock price updates
        socket.on("stockPriceUpdated", (stockData) => {
            // Use dynamic import to avoid circular dependency
            import("./useMarketStore.js").then(({ useMarketStore }) => {
                const { stocks } = useMarketStore.getState();

                const updatedStocks = stocks.map(stock =>
                    stock._id === stockData.stockId ? { ...stock, price: stockData.price } : stock
                );

                useMarketStore.getState().updateStocks(updatedStocks);
            });

            toast.success(`${stockData.ticker} price updated to $${stockData.price}`, {
                duration: 3000,
            });
        });

        // Listen for market status changes
        socket.on("marketStatusChanged", (data) => {
            import("./useMarketStore.js").then(({ useMarketStore }) => {
                useMarketStore.getState().updateMarketStatus(data.isOpen);
            });

            toast.success(data.message, {
                duration: 4000,
            });
        });

        set({ socket });
    },

    // Disconnect socket
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.disconnect();
        }
        set({ socket: null, isConnected: false, onlineUsers: [] });
    },

    // Emit stock price update (admin only)
    emitStockPriceUpdate: (stockData) => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.emit("stockPriceUpdate", stockData);
        }
    },

    // Emit market status change (admin only)
    emitMarketStatusChange: (data) => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.emit("marketStatusChange", data);
        }
    },

    // Get online users count
    getOnlineUsersCount: () => {
        return get().onlineUsers.length;
    },

    // Check if user is online
    isUserOnline: (userId) => {
        return get().onlineUsers.includes(userId);
    }
}));
