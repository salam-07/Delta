import { Newspaper, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Panel, PanelHeader } from "../ui/Panel";
import { Button } from "../ui/Button";
import { EmptyState, SkeletonRows } from "../ui/Feedback";
import { dateTime } from "../../lib/format";

/**
 * The development wire: what the administrator has published into the market,
 * newest first.
 *
 * A wire, not a card grid — a participant scans headlines against the clock to
 * work out why a price moved, and a four-across grid of equal-weight cards
 * makes that scan slower, not faster.
 */
const UserDevTable = ({
    devs = [],
    isLoading = false,
    onRefresh = () => { },
    showRefreshButton = true,
    title = "Developments"
}) => {
    // `/market/viewdevs` already filters to published developments; this holds
    // the guarantee at the component that renders them to participants.
    const published = devs.filter((dev) => dev.posted === true);

    const lede = (content, maxLength = 160) => {
        if (!content) return "";
        if (content.length <= maxLength) return content;
        const cut = content.slice(0, maxLength);
        const lastSpace = cut.lastIndexOf(" ");
        return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`;
    };

    return (
        <Panel>
            <PanelHeader label={title}>
                {showRefreshButton ? (
                    <Button size="sm" variant="ghost" onClick={onRefresh} disabled={isLoading}>
                        <RefreshCw className={`size-3 shrink-0 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
                        Refresh
                    </Button>
                ) : null}
            </PanelHeader>

            {isLoading && published.length === 0 ? (
                <SkeletonRows rows={3} />
            ) : published.length === 0 ? (
                <EmptyState
                    icon={Newspaper}
                    label="Nothing on the wire"
                    description="No developments have been published to the market yet. Published news appears here as it breaks."
                />
            ) : (
                <ul>
                    {published.map((dev) => (
                        <li key={dev._id}>
                            <Link
                                to={`/user/developments/${dev._id}`}
                                className="group flex flex-col gap-1 border-b border-phosphor/15 px-4 py-3.5 transition-colors hover:bg-phosphor/5 sm:flex-row sm:gap-4"
                            >
                                <span className="shrink-0 font-term text-[11px] uppercase tracking-label text-signal-cyanDim sm:w-40 sm:pt-0.5">
                                    {dateTime(dev.createdAt ?? dev.updatedAt)}
                                </span>
                                <span className="min-w-0">
                                    <span className="block font-term text-sm text-phosphor-bright transition-colors group-hover:text-phosphor">
                                        {dev.title || "Untitled development"}
                                    </span>
                                    {dev.content ? (
                                        <span className="mt-1 block font-term text-xs leading-relaxed text-phosphor-mid">
                                            {lede(dev.content)}
                                        </span>
                                    ) : null}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </Panel>
    );
};

export default UserDevTable;
