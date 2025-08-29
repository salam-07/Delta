import History from "../models/history.model.js";

export const viewStockHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const history = await History.find({ stockId: id });

        if (!history) {
            return res.status(404).json({ message: "History not found" });
        }

        res.status(200).json(history);
    } catch (error) {
        console.log("Error in viewStockHistory controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};