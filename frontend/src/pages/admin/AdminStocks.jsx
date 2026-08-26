import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import AdminStockTable from "../../components/admin/AdminStockTable";
import AdminLayout from "../../layouts/AdminLayout";
import { Panel, PanelHeader } from "../../components/ui/Panel";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/Field";

const EMPTY = { ticker: "", name: "", price: "" };

/**
 * Stock management: list a new company, and adjust or delist an existing one.
 *
 * The new-listing form is disclosed by a labelled button. It used to be an
 * icon-only `<Plus>` with no accessible name, above a form whose only heading
 * was a green `TrendingUp` glyph with no text beside it.
 */
const AdminStocks = () => {
    const { createStock, creatingStock } = useAdminStore();

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const price = parseFloat(form.price);
        if (!form.ticker.trim() || !form.name.trim() || !Number.isFinite(price) || price <= 0) return;

        const created = await createStock({
            ticker: form.ticker.trim().toUpperCase(),
            name: form.name.trim(),
            price,
        });

        // The form stays filled on failure so the entry is not lost to a
        // duplicate ticker or a dropped connection.
        if (created) {
            setForm(EMPTY);
            setShowForm(false);
        }
    };

    const close = () => {
        setForm(EMPTY);
        setShowForm(false);
    };

    return (
        <AdminLayout
            title="Stocks"
            actions={
                <Button variant={showForm ? "ghost" : "primary"} size="sm" onClick={() => (showForm ? close() : setShowForm(true))}>
                    {showForm ? (
                        <X className="size-3 shrink-0" aria-hidden="true" />
                    ) : (
                        <Plus className="size-3 shrink-0" aria-hidden="true" />
                    )}
                    {showForm ? "Cancel" : "List a stock"}
                </Button>
            }
        >
            <div className="space-y-6">
                {showForm ? (
                    <Panel ticks>
                        <PanelHeader label="New listing" />
                        <form onSubmit={handleSubmit} className="space-y-5 px-4 py-5">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <TextField
                                    label="Ticker"
                                    name="ticker"
                                    value={form.ticker}
                                    onChange={handleChange}
                                    placeholder="AAPL"
                                    maxLength={6}
                                    autoComplete="off"
                                    spellCheck="false"
                                    className="uppercase"
                                    hint="Up to 6 characters, uppercased."
                                    required
                                />
                                <TextField
                                    label="Company name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Apple Inc."
                                    autoComplete="off"
                                    required
                                />
                                <TextField
                                    label="Opening price"
                                    name="price"
                                    type="number"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0.01"
                                    prefix="$"
                                    hint="Sets both the listing price and the day's open."
                                    required
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3 border-t border-phosphor/15 pt-4">
                                <Button type="submit" variant="primary" loading={creatingStock}>
                                    List stock
                                </Button>
                                <Button variant="ghost" onClick={close}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Panel>
                ) : null}

                <AdminStockTable title="Listings" />
            </div>
        </AdminLayout>
    );
};

export default AdminStocks;
