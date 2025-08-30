import { create } from "zustand";
import toast from "react-hot-toast";

export const useMarketStore = create((set, get) => ({
    marketOpen: false,
    isMarketOpening: false,

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
}));
