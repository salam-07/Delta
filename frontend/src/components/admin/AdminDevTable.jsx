import { Link } from "react-router-dom";
import { ExternalLink, Newspaper, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import { Panel, PanelHeader } from "../ui/Panel";
import { Button } from "../ui/Button";
import { EmptyState, SkeletonRows, StatusPill } from "../ui/Feedback";
import { dateTime, money } from "../../lib/format";

/**
 * The development queue: drafts and published items in one list, newest first.
 *
 * A list, not the four-across card grid this was. An administrator scans for
 * one item to publish or fix, and every action is a visible control: the row's
 * buttons used to be `opacity-0 group-hover:opacity-100`, which put them out of
 * reach of the keyboard and of touch entirely.
 *
 * The status is a fact, stated. Publishing is a labelled button beside it — the
 * badge itself used to be the toggle, a `<span>` with a hover lift.
 */
const AdminDevTable = ({
    devs = [],
    isLoading = false,
    onRefresh = null,
    onToggleStatus = null,
    onEdit = null,
    onDelete = null,
    showRefreshButton = true,
    title = "Developments",
    emptyAction = null,
}) => {
    const { postingDevId, deletingDevId } = useAdminStore();

    const lede = (content, maxLength = 200) => {
        if (!content) return "";
        if (content.length <= maxLength) return content;
        const cut = content.slice(0, maxLength);
        const lastSpace = cut.lastIndexOf(" ");
        return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`;
    };

    return (
        <Panel>
            <PanelHeader label={title}>
                {showRefreshButton && onRefresh ? (
                    <Button size="sm" variant="ghost" onClick={onRefresh} disabled={isLoading}>
                        <RefreshCw className={`size-3 shrink-0 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
                        Refresh
                    </Button>
                ) : null}
            </PanelHeader>

            {isLoading && devs.length === 0 ? (
                <SkeletonRows rows={3} />
            ) : devs.length === 0 ? (
                <EmptyState
                    icon={Newspaper}
                    label="No developments"
                    description="Developments are the news that moves this market. Draft one, set the prices it should trigger, then publish it to the wire."
                    action={emptyAction}
                />
            ) : (
                <ul>
                    {devs.map((dev) => {
                        const moves = dev.stockPriceChanges ?? [];
                        return (
                            <li key={dev._id} className="border-b border-phosphor/15 px-4 py-4 last:border-b-0">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                    <StatusPill tone={dev.posted ? "live" : "draft"}>
                                        {dev.posted ? "Published" : "Draft"}
                                    </StatusPill>
                                    <span className="font-term text-[11px] uppercase tracking-label text-signal-cyanDim">
                                        {dateTime(dev.createdAt ?? dev.updatedAt)}
                                    </span>
                                </div>

                                <h3 className="mt-2 font-term text-sm leading-snug text-phosphor-bright">
                                    <Link
                                        to={`/admin/developments/${dev._id}`}
                                        className="transition-colors hover:text-phosphor hover:underline hover:underline-offset-4"
                                    >
                                        {dev.title || "Untitled development"}
                                    </Link>
                                </h3>

                                {dev.content ? (
                                    <p className="mt-1.5 font-term text-xs leading-relaxed text-phosphor-mid">
                                        {lede(dev.content)}
                                    </p>
                                ) : null}

                                {moves.length > 0 ? (
                                    <div className="panel-inset mt-3 px-3 py-2">
                                        <p className="font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                            {dev.posted ? "Prices set on publish" : "Will set on publish"}
                                        </p>
                                        <p className="mt-1 font-term text-[11px] text-phosphor">
                                            {moves
                                                .map((move) => `${move.ticker} → ${money(move.newPrice)}`)
                                                .join("   ")}
                                        </p>
                                    </div>
                                ) : null}

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    {onToggleStatus ? (
                                        <Button
                                            size="sm"
                                            variant={dev.posted ? "default" : "primary"}
                                            onClick={() => onToggleStatus(dev)}
                                            loading={postingDevId === dev._id}
                                        >
                                            {dev.posted ? "Withdraw" : "Publish"}
                                        </Button>
                                    ) : null}
                                    <Button as={Link} to={`/admin/developments/${dev._id}`} size="sm" variant="ghost">
                                        <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
                                        Open
                                    </Button>
                                    {onEdit ? (
                                        <Button size="sm" variant="ghost" onClick={() => onEdit(dev)}>
                                            <Pencil className="size-3 shrink-0" aria-hidden="true" />
                                            Edit
                                        </Button>
                                    ) : null}
                                    {onDelete ? (
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => onDelete(dev)}
                                            loading={deletingDevId === dev._id}
                                            className="ml-auto"
                                        >
                                            <Trash2 className="size-3 shrink-0" aria-hidden="true" />
                                            Delete
                                        </Button>
                                    ) : null}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </Panel>
    );
};

export default AdminDevTable;
