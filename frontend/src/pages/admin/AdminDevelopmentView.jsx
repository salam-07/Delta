import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import { useMarketStore } from "../../store/useMarketStore";
import AdminLayout from "../../layouts/AdminLayout";
import { Panel, PanelHeader } from "../../components/ui/Panel";
import { Button } from "../../components/ui/Button";
import { ErrorPanel, LoadingPanel, StatusPill } from "../../components/ui/Feedback";
import { dateTime, money } from "../../lib/format";

/**
 * A single development as the administrator sees it: draft or published, the
 * prices it carries, and the one control that puts it on the wire.
 *
 * Publishing is a labelled button. It used to be the status badge itself — a
 * `<span>` with `cursor-pointer` and a hover lift, unreachable by keyboard and
 * silent to a screen reader.
 */
const AdminDevelopmentView = () => {
    const { devId } = useParams();

    const { postDev, postingDevId } = useAdminStore();
    const { fetchDevAsAdmin, dev, isDevLoading } = useMarketStore();

    useEffect(() => {
        if (devId) fetchDevAsAdmin(devId);
    }, [devId, fetchDevAsAdmin]);

    const handleToggleStatus = async () => {
        if (!dev) return;
        const changed = await postDev(devId, { status: !dev.posted });
        if (changed) fetchDevAsAdmin(devId);
    };

    const backToQueue = (
        <Button as={Link} to="/admin/developments" size="sm" variant="ghost">
            <ArrowLeft className="size-3 shrink-0" aria-hidden="true" />
            Developments
        </Button>
    );

    if (isDevLoading) {
        return (
            <AdminLayout title="Development" actions={backToQueue}>
                <Panel>
                    <LoadingPanel label="Loading development" />
                </Panel>
            </AdminLayout>
        );
    }

    if (!dev) {
        return (
            <AdminLayout title="Development" actions={backToQueue}>
                <Panel>
                    <ErrorPanel
                        label="Development not found"
                        description="This development does not exist or has been deleted."
                        action={
                            <Button as={Link} to="/admin/developments" variant="primary">
                                Back to developments
                            </Button>
                        }
                    />
                </Panel>
            </AdminLayout>
        );
    }

    const moves = dev.stockPriceChanges ?? [];

    return (
        <AdminLayout title="Development" actions={backToQueue}>
            <div className="mx-auto max-w-3xl space-y-6">
                <Panel>
                    <PanelHeader label="Publish state">
                        <StatusPill tone={dev.posted ? "live" : "draft"}>
                            {dev.posted ? "Published" : "Draft"}
                        </StatusPill>
                    </PanelHeader>
                    <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-md font-term text-xs leading-relaxed text-phosphor-mid">
                            {dev.posted
                                ? "This is on the wire and readable by every participant. Withdrawing it hides it again; the prices it set stay where they are."
                                : moves.length > 0
                                    ? "Participants cannot read this yet. Publishing puts it on the wire and applies the prices below at once."
                                    : "Participants cannot read this yet. Publishing puts it on the wire."}
                        </p>
                        <Button
                            variant={dev.posted ? "default" : "primary"}
                            onClick={handleToggleStatus}
                            loading={postingDevId === devId}
                            className="sm:w-40"
                        >
                            {dev.posted ? "Withdraw" : "Publish"}
                        </Button>
                    </div>
                </Panel>

                {moves.length > 0 ? (
                    <Panel>
                        <PanelHeader label={dev.posted ? "Prices this set" : "Prices this will set"} />
                        <ul>
                            {moves.map((move) => (
                                <li
                                    key={move.stockId ?? move.ticker}
                                    className="flex items-center justify-between gap-4 border-b border-phosphor/15 px-4 py-3 last:border-b-0"
                                >
                                    <span className="border border-phosphor/30 bg-phosphor/10 px-1.5 py-0.5 font-term text-xs text-phosphor">
                                        {move.ticker}
                                    </span>
                                    <span className="font-term text-sm text-phosphor-bright">
                                        {money(move.newPrice)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Panel>
                ) : null}

                <Panel ticks as="article">
                    <header className="border-b border-phosphor/20 px-5 py-5">
                        <p className="font-term text-[11px] uppercase tracking-label text-signal-cyanDim">
                            {dateTime(dev.createdAt)}
                        </p>
                        <h2 className="mt-2 font-board text-2xl leading-tight tracking-cell text-phosphor-bright sm:text-3xl">
                            {dev.title || "Untitled development"}
                        </h2>
                    </header>

                    {dev.content ? (
                        <div className="whitespace-pre-wrap px-5 py-6 font-term text-sm leading-relaxed text-phosphor-bright">
                            {dev.content}
                        </div>
                    ) : (
                        <p className="px-5 py-6 font-term text-sm text-phosphor-mid">
                            This development has no body yet. Participants would see an empty item on the wire.
                        </p>
                    )}

                    {dev.updatedAt && dev.updatedAt !== dev.createdAt ? (
                        <footer className="border-t border-phosphor/20 bg-ink-raised px-5 py-2.5">
                            <p className="font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                Revised {dateTime(dev.updatedAt)}
                            </p>
                        </footer>
                    ) : null}
                </Panel>
            </div>
        </AdminLayout>
    );
};

export default AdminDevelopmentView;
