import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import { useMarketStore } from "../../store/useMarketStore";
import AdminDevTable from "../../components/admin/AdminDevTable";
import AdminLayout from "../../layouts/AdminLayout";
import { Panel, PanelHeader } from "../../components/ui/Panel";
import { Button } from "../../components/ui/Button";
import { FieldLabel, InlineNumberField, TextAreaField, TextField } from "../../components/ui/Field";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { EmptyState, LoadingPanel } from "../../components/ui/Feedback";
import { money } from "../../lib/format";

const BLANK = { mode: "create", devId: null, title: "", content: "", targets: [] };

/**
 * Development management: draft the news, set the prices it will trigger,
 * publish it.
 *
 * One form serves both create and edit. The two were ~140 duplicated lines
 * apart differing only in accent colour and button label, which meant every
 * change to the price-target list had to be made twice and the edit form
 * introduced a fourth accent hue to the product for no semantic reason.
 */
const AdminDevelopments = () => {
    const { createDev, deleteDev, postDev, updateDev, creatingDev, updatingDev, deletingDevId } = useAdminStore();

    const { fetchAllDevsAsAdmin, devs, isDevsLoading, fetchAllStocks, stocks, isStocksLoading } = useMarketStore();

    // `null` means no form is open. Holding create and edit in one value makes
    // it impossible to have both on screen at once.
    const [form, setForm] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);

    useEffect(() => {
        fetchAllDevsAsAdmin();
        fetchAllStocks();
    }, [fetchAllDevsAsAdmin, fetchAllStocks]);

    const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

    const targetFor = (stockId) => form?.targets.find((target) => target.stockId === stockId)?.newPrice ?? "";

    const setTarget = (stock, raw) => {
        setForm((prev) => {
            const rest = prev.targets.filter((target) => target.stockId !== stock._id);
            const parsed = parseFloat(raw);
            if (raw === "" || !Number.isFinite(parsed) || parsed <= 0) return { ...prev, targets: rest };
            return { ...prev, targets: [...rest, { stockId: stock._id, ticker: stock.ticker, newPrice: parsed }] };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim()) return;

        const payload = {
            title: form.title.trim(),
            content: form.content.trim(),
            stockPriceChanges: form.targets,
        };

        // The form stays filled on failure — a duplicate title rejects the
        // whole request, and losing the draft to it would be worse than the
        // rejection itself.
        const saved = form.mode === "edit" ? await updateDev(form.devId, payload) : await createDev(payload);
        if (saved) setForm(null);
    };

    const startEdit = (dev) =>
        setForm({
            mode: "edit",
            devId: dev._id,
            title: dev.title || "",
            content: dev.content || "",
            targets: (dev.stockPriceChanges ?? []).map(({ stockId, ticker, newPrice }) => ({
                stockId,
                ticker,
                newPrice,
            })),
        });

    const isEdit = form?.mode === "edit";
    const saving = isEdit ? updatingDev : creatingDev;

    return (
        <AdminLayout
            title="Developments"
            actions={
                <Button
                    variant={form ? "ghost" : "primary"}
                    size="sm"
                    onClick={() => setForm(form ? null : BLANK)}
                >
                    {form ? (
                        <X className="size-3 shrink-0" aria-hidden="true" />
                    ) : (
                        <Plus className="size-3 shrink-0" aria-hidden="true" />
                    )}
                    {form ? "Close" : "Draft a development"}
                </Button>
            }
        >
            <div className="space-y-6">
                {form ? (
                    <Panel ticks>
                        <PanelHeader label={isEdit ? "Edit development" : "New development"} />

                        <form onSubmit={handleSubmit} className="space-y-5 px-4 py-5">
                            <TextField
                                label="Headline"
                                value={form.title}
                                onChange={(e) => setField("title", e.target.value)}
                                placeholder="Central bank holds rates"
                                autoComplete="off"
                                hint="Must be unique across all developments."
                                required
                            />

                            <TextAreaField
                                label="Body"
                                value={form.content}
                                onChange={(e) => setField("content", e.target.value)}
                                placeholder="What happened, and what it means for the market."
                                rows={8}
                                required
                            />

                            <div className="space-y-2">
                                <FieldLabel>Price targets — optional</FieldLabel>
                                <p className="font-term text-[11px] leading-relaxed text-phosphor-mid">
                                    Leave a listing blank to leave its price alone. Any price you set here is applied
                                    the moment this development is published, not now.
                                </p>

                                {isStocksLoading && stocks.length === 0 ? (
                                    <div className="panel-inset">
                                        <LoadingPanel label="Loading listings" />
                                    </div>
                                ) : stocks.length === 0 ? (
                                    <div className="panel-inset">
                                        <EmptyState
                                            label="No listings"
                                            description="There are no stocks to move. This development can still be published as news."
                                        />
                                    </div>
                                ) : (
                                    <div className="panel-inset max-h-72 overflow-y-auto">
                                        <ul>
                                            {stocks.map((stock) => (
                                                <li
                                                    key={stock._id}
                                                    className="flex items-center justify-between gap-3 border-b border-phosphor/10 px-3 py-2.5 last:border-b-0"
                                                >
                                                    <span className="min-w-0">
                                                        <span className="block font-term text-xs text-phosphor-bright">
                                                            {stock.ticker}
                                                        </span>
                                                        <span className="block truncate font-term text-[11px] text-phosphor-mid">
                                                            {stock.name} · now {money(stock.price)}
                                                        </span>
                                                    </span>
                                                    <InlineNumberField
                                                        value={targetFor(stock._id)}
                                                        onChange={(e) => setTarget(stock, e.target.value)}
                                                        placeholder="—"
                                                        step="0.01"
                                                        min="0.01"
                                                        className="w-24 shrink-0"
                                                        aria-label={`Target price for ${stock.ticker} in dollars`}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {form.targets.length > 0 ? (
                                    <p className="font-term text-[11px] leading-relaxed text-signal-cyan">
                                        On publish:{" "}
                                        {form.targets
                                            .map((target) => `${target.ticker} → ${money(target.newPrice)}`)
                                            .join("   ")}
                                    </p>
                                ) : null}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 border-t border-phosphor/15 pt-4">
                                <Button type="submit" variant="primary" loading={saving}>
                                    {isEdit ? "Save changes" : "Save draft"}
                                </Button>
                                <Button variant="ghost" onClick={() => setForm(null)}>
                                    Cancel
                                </Button>
                                {!isEdit ? (
                                    <span className="font-term text-[11px] text-phosphor-mid">
                                        Saved as a draft. Nothing reaches participants until you publish it.
                                    </span>
                                ) : null}
                            </div>
                        </form>
                    </Panel>
                ) : null}

                <AdminDevTable
                    devs={devs}
                    isLoading={isDevsLoading}
                    onRefresh={fetchAllDevsAsAdmin}
                    onToggleStatus={(dev) => postDev(dev._id, { status: !dev.posted })}
                    onEdit={startEdit}
                    onDelete={setPendingDelete}
                    title="All developments"
                    emptyAction={
                        <Button variant="primary" onClick={() => setForm(BLANK)}>
                            Draft a development
                        </Button>
                    }
                />
            </div>

            <ConfirmDialog
                open={Boolean(pendingDelete)}
                title="Delete this development?"
                description={
                    pendingDelete
                        ? `“${pendingDelete.title || "Untitled development"}” is removed permanently, along with the price targets it carries.${pendingDelete.posted ? " It is currently published, so participants will lose access to it; any prices it already set stay where they are." : ""}`
                        : undefined
                }
                loading={deletingDevId === pendingDelete?._id}
                onConfirm={async () => {
                    const id = pendingDelete._id;
                    setPendingDelete(null);
                    if (form?.devId === id) setForm(null);
                    await deleteDev(id);
                }}
                onCancel={() => setPendingDelete(null)}
            />
        </AdminLayout>
    );
};

export default AdminDevelopments;
