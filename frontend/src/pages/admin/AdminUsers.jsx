import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, RefreshCw, Users } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAdminStore } from "../../store/useAdminStore";
import { useMarketStore } from "../../store/useMarketStore";
import { useSocketStore } from "../../store/useSocketStore";
import { Panel, PanelHeader } from "../../components/ui/Panel";
import { Button } from "../../components/ui/Button";
import { SelectField, TextField } from "../../components/ui/Field";
import { EmptyState, Lamp, SkeletonRows } from "../../components/ui/Feedback";
import { Readout, ReadoutStrip } from "../../components/ui/Readout";
import { count, initial, money } from "../../lib/format";

const PAGE = 20;

const STARTING_CASH = 3000;

const COLUMNS = [
    { key: "fullName", label: "Participant", align: "left" },
    { key: "email", label: "Email", align: "left" },
    { key: "balance", label: "Cash", align: "right" },
    { key: "portfolioValue", label: "Holdings", align: "right" },
    { key: "totalAssets", label: "Net worth", align: "right" },
    { key: "holdingsCount", label: "Positions", align: "right" },
];

/**
 * The participant roster, ranked by net worth.
 *
 * Sorting lives in the column headers on wide screens and in a select below
 * them, so the same state is never presented twice at one breakpoint. The
 * headers were `<th onClick>` before — unreachable by keyboard, with the sort
 * direction shown as a bare Unicode arrow and no `aria-sort` for a screen
 * reader to read.
 */
const AdminUsers = () => {
    const { users, isUsersLoading, getAllUsers } = useAdminStore();
    const { stocks, fetchAllStocks } = useMarketStore();
    const { onlineUsers } = useSocketStore();

    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState("totalAssets");
    const [sortOrder, setSortOrder] = useState("desc");
    const [presence, setPresence] = useState("all");
    const [visible, setVisible] = useState(PAGE);

    useEffect(() => {
        getAllUsers();
        fetchAllStocks();
    }, [getAllUsers, fetchAllStocks]);

    // `onlineUsers` was missing from these dependencies, so presence froze at
    // whatever it happened to be when the roster first loaded. The empty-stocks
    // guard was also here, which blanked the whole roster before any stock was
    // listed — a participant with no holdings still has cash and a name.
    const roster = useMemo(
        () =>
            users.map((user) => {
                const portfolioValue = (user.portfolio ?? []).reduce((total, holding) => {
                    const stock = stocks.find((candidate) => candidate.ticker === holding.ticker);
                    const price = stock ? Number(stock.price) : 0;
                    const amount = Number(holding.amount) || 0;
                    return total + price * amount;
                }, 0);

                const balance = Number(user.balance) || 0;

                return {
                    ...user,
                    portfolioValue,
                    totalAssets: balance + portfolioValue,
                    holdingsCount: (user.portfolio ?? []).length,
                    isOnline: onlineUsers.includes(user._id),
                };
            }),
        [users, stocks, onlineUsers]
    );

    const shown = useMemo(() => {
        const needle = query.trim().toLowerCase();

        const filtered = roster.filter((user) => {
            if (presence === "online" && !user.isOnline) return false;
            if (presence === "offline" && user.isOnline) return false;
            if (!needle) return true;
            return (
                user.fullName?.toLowerCase().includes(needle) || user.email?.toLowerCase().includes(needle)
            );
        });

        return [...filtered].sort((a, b) => {
            const left = a[sortBy];
            const right = b[sortBy];
            const comparison =
                typeof left === "string"
                    ? left.localeCompare(right ?? "", undefined, { sensitivity: "base" })
                    : (left ?? 0) - (right ?? 0);
            return sortOrder === "asc" ? comparison : -comparison;
        });
    }, [roster, query, sortBy, sortOrder, presence]);

    const toggleSort = (key) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(key);
            setSortOrder(key === "fullName" || key === "email" ? "asc" : "desc");
        }
    };

    const ariaSort = (key) => (sortBy !== key ? "none" : sortOrder === "asc" ? "ascending" : "descending");

    const SortIcon = sortOrder === "asc" ? ArrowUp : ArrowDown;

    const online = roster.filter((user) => user.isOnline).length;
    const totalAssets = roster.reduce((sum, user) => sum + user.totalAssets, 0);
    const totalCash = roster.reduce((sum, user) => sum + (Number(user.balance) || 0), 0);

    const refresh = () => {
        getAllUsers();
        fetchAllStocks();
    };

    return (
        <AdminLayout
            title="Participants"
            actions={
                <Button size="sm" variant="ghost" onClick={refresh} disabled={isUsersLoading}>
                    <RefreshCw
                        className={`size-3 shrink-0 ${isUsersLoading ? "animate-spin" : ""}`}
                        aria-hidden="true"
                    />
                    Refresh
                </Button>
            }
        >
            <div className="space-y-6">
                <Panel ticks>
                    <PanelHeader label="Roster" />
                    <ReadoutStrip cols={4}>
                        <Readout label="Participants" value={count(roster.length)} />
                        <Readout label="Online now" value={count(online)} tone="accent" />
                        <Readout label="Cash held" value={money(totalCash)} />
                        <Readout
                            label="Net worth"
                            value={money(totalAssets)}
                            note={`Started from ${money(roster.length * STARTING_CASH)}`}
                        />
                    </ReadoutStrip>
                </Panel>

                <Panel>
                    <PanelHeader label={`${shown.length} of ${roster.length} shown`} />

                    <div className="grid grid-cols-1 gap-4 border-b border-phosphor/15 px-4 py-4 sm:grid-cols-2 lg:grid-cols-3">
                        <TextField
                            label="Search"
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Name or email"
                            autoComplete="off"
                        />
                        <SelectField label="Presence" value={presence} onChange={(e) => setPresence(e.target.value)}>
                            <option value="all">All participants</option>
                            <option value="online">Online only</option>
                            <option value="offline">Offline only</option>
                        </SelectField>
                        <SelectField
                            label="Sort by"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            containerClassName="lg:hidden"
                        >
                            {COLUMNS.map((column) => (
                                <option key={column.key} value={column.key}>
                                    {column.label}
                                </option>
                            ))}
                        </SelectField>
                    </div>

                    {isUsersLoading && roster.length === 0 ? (
                        <SkeletonRows rows={8} />
                    ) : shown.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            label={roster.length === 0 ? "No participants" : "Nothing matches"}
                            description={
                                roster.length === 0
                                    ? "Nobody has signed up yet. Participants appear here as they register."
                                    : "No participant matches this search and presence filter."
                            }
                            action={
                                roster.length > 0 ? (
                                    <Button
                                        variant="default"
                                        onClick={() => {
                                            setQuery("");
                                            setPresence("all");
                                        }}
                                    >
                                        Clear filters
                                    </Button>
                                ) : null
                            }
                        />
                    ) : (
                        <>
                            {/* Table — lg and up */}
                            <div className="hidden overflow-x-auto lg:block">
                                <table className="w-full min-w-[52rem]">
                                    <caption className="sr-only">
                                        Participants with cash, holdings value and net worth
                                    </caption>
                                    <thead>
                                        <tr className="border-b border-phosphor/20 bg-ink-raised">
                                            {COLUMNS.map((column) => (
                                                <th
                                                    key={column.key}
                                                    scope="col"
                                                    aria-sort={ariaSort(column.key)}
                                                    className={`px-4 py-0 ${column.align === "right" ? "text-right" : "text-left"}`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSort(column.key)}
                                                        className={`flex w-full items-center gap-1.5 py-2 font-term text-[10px]
                                                            uppercase tracking-label transition-colors hover:text-phosphor
                                                            ${column.align === "right" ? "justify-end" : "justify-start"}
                                                            ${sortBy === column.key ? "text-phosphor" : "text-phosphor-mid"}`}
                                                    >
                                                        {column.label}
                                                        {sortBy === column.key ? (
                                                            <SortIcon className="size-3 shrink-0" aria-hidden="true" />
                                                        ) : null}
                                                    </button>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shown.slice(0, visible).map((user) => (
                                            <tr key={user._id} className="data-row">
                                                <td className="px-4 py-3">
                                                    <span className="flex items-center gap-2.5">
                                                        <span
                                                            aria-hidden="true"
                                                            className="flex size-6 shrink-0 items-center justify-center border border-phosphor/25 bg-phosphor/10 font-term text-[10px] text-phosphor"
                                                        >
                                                            {initial(user.fullName)}
                                                        </span>
                                                        <span className="font-term text-sm text-phosphor-bright">
                                                            {user.fullName || "Unnamed"}
                                                        </span>
                                                        <Lamp on={user.isOnline} />
                                                        <span className="sr-only">
                                                            {user.isOnline ? "Online" : "Offline"}
                                                        </span>
                                                    </span>
                                                </td>
                                                <td className="max-w-[15rem] truncate px-4 py-3 font-term text-xs text-phosphor-mid">
                                                    {user.email}
                                                </td>
                                                <td className="px-4 py-3 text-right font-term text-sm text-phosphor-bright">
                                                    {money(user.balance)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-term text-sm text-phosphor-bright">
                                                    {money(user.portfolioValue)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-term text-sm text-phosphor">
                                                    {money(user.totalAssets)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-term text-sm text-phosphor-mid">
                                                    {count(user.holdingsCount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Stacked rows — below lg */}
                            <ul className="lg:hidden">
                                {shown.slice(0, visible).map((user) => (
                                    <li key={user._id} className="border-b border-phosphor/15 px-4 py-3.5 last:border-b-0">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="flex min-w-0 items-center gap-2">
                                                <Lamp on={user.isOnline} />
                                                <span className="truncate font-term text-sm text-phosphor-bright">
                                                    {user.fullName || "Unnamed"}
                                                </span>
                                            </span>
                                            <span className="shrink-0 font-term text-sm text-phosphor">
                                                {money(user.totalAssets)}
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate font-term text-[11px] text-phosphor-mid">
                                            {user.email}
                                        </p>
                                        <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-term text-[11px] text-phosphor-mid">
                                            <span className="flex gap-1.5">
                                                <dt>Cash</dt>
                                                <dd className="text-phosphor-bright">{money(user.balance)}</dd>
                                            </span>
                                            <span className="flex gap-1.5">
                                                <dt>Holdings</dt>
                                                <dd className="text-phosphor-bright">{money(user.portfolioValue)}</dd>
                                            </span>
                                            <span className="flex gap-1.5">
                                                <dt>Positions</dt>
                                                <dd className="text-phosphor-bright">{count(user.holdingsCount)}</dd>
                                            </span>
                                        </dl>
                                    </li>
                                ))}
                            </ul>

                            {visible < shown.length ? (
                                <div className="border-t border-phosphor/20 px-4 py-3">
                                    <Button variant="default" size="sm" onClick={() => setVisible((n) => n + PAGE)}>
                                        Show {Math.min(PAGE, shown.length - visible)} more
                                    </Button>
                                </div>
                            ) : null}
                        </>
                    )}
                </Panel>
            </div>
        </AdminLayout>
    );
};

export default AdminUsers;
