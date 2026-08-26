import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useMarketStore } from "../../store/useMarketStore";
import { useAdminStore } from "../../store/useAdminStore";
import AdminLayout from "../../layouts/AdminLayout";
import AdminStockTable from "../../components/admin/AdminStockTable";
import AdminDevTable from "../../components/admin/AdminDevTable";
import { Panel, PanelHeader } from "../../components/ui/Panel";
import { Button } from "../../components/ui/Button";
import { Lamp } from "../../components/ui/Feedback";
import { Readout, ReadoutStrip } from "../../components/ui/Readout";
import { count } from "../../lib/format";

/**
 * The administrator's overview: the one switch that stops and starts trading,
 * the board as participants see it, and what is queued on the wire.
 */
const AdminHome = () => {
    const {
        marketOpen,
        toggleMarketStatus,
        isMarketStatusLoading,
        fetchMarketStatus,
        fetchAllStocks,
        stocks,
        devs,
        isDevsLoading,
        fetchAllDevsAsAdmin,
    } = useMarketStore();
    const { postDev } = useAdminStore();

    // `fetchAllDevsAsAdmin` was missing from this effect, so the developments
    // panel below was permanently empty on a fresh load.
    useEffect(() => {
        fetchAllStocks();
        fetchMarketStatus();
        fetchAllDevsAsAdmin();
    }, [fetchAllStocks, fetchMarketStatus, fetchAllDevsAsAdmin]);

    // `postDev` was called here without being imported, so publishing from the
    // overview threw a ReferenceError instead of publishing anything.
    const handleToggleStatus = (dev) => postDev(dev._id, { status: !dev.posted });

    const published = devs.filter((dev) => dev.posted).length;

    return (
        <AdminLayout title="Overview">
            <div className="space-y-6">
                <Panel ticks>
                    <PanelHeader label="Market state">
                        <span className="flex items-center gap-2 font-term text-[11px] uppercase tracking-label">
                            <Lamp on={marketOpen} />
                            <span className={marketOpen ? "text-signal-up" : "text-signal-down"}>
                                {marketOpen ? "Open" : "Closed"}
                            </span>
                        </span>
                    </PanelHeader>

                    <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-md font-term text-xs leading-relaxed text-phosphor-mid">
                            {marketOpen
                                ? "Orders are being accepted. Closing the market blocks every buy and sell until you open it again."
                                : "Orders are being rejected. Participants can read the board and the wire, but cannot trade."}
                        </p>
                        <Button
                            variant={marketOpen ? "danger" : "primary"}
                            size="lg"
                            onClick={toggleMarketStatus}
                            loading={isMarketStatusLoading}
                            className="sm:w-44"
                        >
                            {marketOpen ? "Close market" : "Open market"}
                        </Button>
                    </div>

                    <ReadoutStrip cols={3} className="border-t border-phosphor/20">
                        <Readout label="Listings" value={count(stocks.length)} />
                        <Readout label="Published" value={count(published)} tone="accent" />
                        <Readout label="Drafts" value={count(devs.length - published)} tone="muted" />
                    </ReadoutStrip>
                </Panel>

                <AdminStockTable
                    showActions={false}
                    showDeleteColumn={false}
                    showRefreshButton={false}
                    title="Board"
                />

                <AdminDevTable
                    devs={devs}
                    isLoading={isDevsLoading}
                    onRefresh={fetchAllDevsAsAdmin}
                    onToggleStatus={handleToggleStatus}
                    showRefreshButton={false}
                    title="The wire"
                    emptyAction={
                        <Button as={Link} to="/admin/developments" variant="primary">
                            Draft a development
                        </Button>
                    }
                />
            </div>
        </AdminLayout>
    );
};

export default AdminHome;
