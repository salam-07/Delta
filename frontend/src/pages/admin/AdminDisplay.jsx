import { useEffect, useMemo, useState } from "react";
import { useMarketStore } from "../../store/useMarketStore";
import { useAdminStore } from "../../store/useAdminStore";
import { useSocketStore } from "../../store/useSocketStore";
import { Change } from "../../components/ui/Readout";
import { Lamp } from "../../components/ui/Feedback";
import { clockTime, count, money, priceChange } from "../../lib/format";

/** How often the roster is re-read for the leaderboard, in milliseconds. */
const ROSTER_POLL = 20_000;

/** Prices shown at once. Anything past this is named in the panel header. */
const BOARD_SIZE = 10;

/**
 * The wall display: a projector board for the room, read from across it.
 *
 * No controls, no navigation, nothing to click — so every pixel is a figure or
 * the rule that separates two figures. Sizes are larger than the rest of the
 * product because the viewing distance is metres, not centimetres.
 */
const AdminDisplay = () => {
    const { stocks, fetchAllStocks, marketOpen } = useMarketStore();
    const { users, getAllUsers } = useAdminStore();
    const { onlineUsers } = useSocketStore();

    const [time, setTime] = useState(() => clockTime());

    useEffect(() => {
        const tick = setInterval(() => setTime(clockTime()), 1000);
        return () => clearInterval(tick);
    }, []);

    useEffect(() => {
        fetchAllStocks();
        getAllUsers();
    }, [fetchAllStocks, getAllUsers]);

    // Balances and holdings change when anyone trades, and no socket event
    // carries that. This used to be an effect keyed on `stocks`, which re-read
    // the whole roster on every broadcast price tick and still missed trades
    // that moved no price. A plain interval does the job and is predictable.
    useEffect(() => {
        const poll = setInterval(getAllUsers, ROSTER_POLL);
        return () => clearInterval(poll);
    }, [getAllUsers]);

    // `stocks.sort()` sorts in place, so this used to reorder the store's own
    // array — and with it the market board every other page reads from.
    const board = useMemo(
        () => [...stocks].sort((a, b) => Number(b.price) - Number(a.price)).slice(0, BOARD_SIZE),
        [stocks]
    );

    const leaderboard = useMemo(
        () =>
            users
                .map((user) => ({
                    id: user._id,
                    name: user.fullName || "Unnamed",
                    assets:
                        (Number(user.balance) || 0) +
                        (user.portfolio ?? []).reduce((sum, holding) => {
                            const live = stocks.find((stock) => stock.ticker === holding.ticker);
                            return sum + (Number(live?.price) || 0) * (Number(holding.amount) || 0);
                        }, 0),
                }))
                .sort((a, b) => b.assets - a.assets)
                .slice(0, 6),
        [users, stocks]
    );

    const tape = stocks.map((stock) => {
        const { percent } = priceChange(stock);
        return (
            <span key={stock._id ?? stock.ticker} className="flex items-center gap-2.5 px-6 text-lg">
                <span className="text-phosphor">{stock.ticker}</span>
                <span className="text-phosphor-bright">{money(stock.price)}</span>
                <Change percent={percent} showAbsolute={false} className="text-lg" />
            </span>
        );
    });

    const rankClass = (index) =>
        index === 0
            ? "bg-phosphor text-ink"
            : index < 3
                ? "border border-phosphor/50 text-phosphor"
                : "border border-phosphor/20 text-phosphor-mid";

    return (
        <div className="flex h-full flex-col overflow-hidden bg-ink">
            <header className="flex shrink-0 flex-wrap items-center gap-x-10 gap-y-3 border-b border-phosphor/30 bg-ink-panel px-6 py-3">
                <h1 className="font-board text-3xl tracking-cell text-phosphor 2xl:text-4xl">
                    DELTA TRADING FLOOR
                </h1>

                <span className="flex items-center gap-2.5 font-term text-xl uppercase tracking-label">
                    <Lamp on={marketOpen} />
                    <span className={marketOpen ? "text-signal-up" : "text-signal-down"}>
                        {marketOpen ? "Market open" : "Market closed"}
                    </span>
                </span>

                <dl className="ml-auto flex shrink-0 items-start gap-10 text-right">
                    <div>
                        <dt className="font-term text-[11px] uppercase tracking-label text-phosphor-mid">
                            Participants live
                        </dt>
                        <dd className="font-term text-2xl text-phosphor-bright">{count(onlineUsers.length)}</dd>
                    </div>
                    <div>
                        <dt className="font-term text-[11px] uppercase tracking-label text-phosphor-mid">
                            Floor clock
                        </dt>
                        <dd className="font-term text-2xl text-phosphor-bright">{time}</dd>
                    </div>
                </dl>
            </header>

            {/* The tape. Two identical copies side by side, each sliding one full
                width left, so the loop closes with no visible seam. */}
            <div className="flex shrink-0 items-center overflow-hidden border-b border-phosphor/20 py-2.5">
                {stocks.length === 0 ? (
                    <p className="px-6 font-term text-lg text-phosphor-mid">
                        No listings yet — the tape starts when the first stock is listed.
                    </p>
                ) : (
                    <>
                        <div className="flex shrink-0 animate-marquee-left items-center font-term">{tape}</div>
                        <div aria-hidden="true" className="flex shrink-0 animate-marquee-left items-center font-term">
                            {tape}
                        </div>
                    </>
                )}
            </div>

            <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
                <section className="flex min-h-0 min-w-0 flex-1 flex-col border-phosphor/20 xl:border-r">
                    <h2 className="flex shrink-0 items-baseline justify-between gap-4 border-b border-phosphor/20 px-6 py-2.5 font-term text-sm uppercase tracking-label text-phosphor-mid">
                        Market prices
                        {stocks.length > BOARD_SIZE ? (
                            <span className="font-term text-xs normal-case tracking-normal">
                                Highest {BOARD_SIZE} of {count(stocks.length)}
                            </span>
                        ) : null}
                    </h2>

                    {board.length === 0 ? (
                        <p className="hatch flex flex-1 items-center justify-center px-6 font-term text-xl text-phosphor-mid">
                            Nothing is listed yet
                        </p>
                    ) : (
                        <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-1 gap-px overflow-y-auto bg-phosphor/15 sm:grid-cols-2">
                            {board.map((stock) => {
                                const { absolute, percent } = priceChange(stock);
                                return (
                                    <div
                                        key={stock._id ?? stock.ticker}
                                        className="flex min-w-0 items-center justify-between gap-6 bg-ink px-6 py-4"
                                    >
                                        <div className="min-w-0">
                                            <div className="font-term text-3xl text-phosphor">{stock.ticker}</div>
                                            <div className="truncate font-term text-sm text-phosphor-mid">
                                                {stock.name}
                                            </div>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <div className="font-term text-3xl text-phosphor-bright">
                                                {money(stock.price)}
                                            </div>
                                            <Change
                                                absolute={absolute}
                                                percent={percent}
                                                size="lg"
                                                className="justify-end text-lg"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="flex min-h-0 shrink-0 flex-col border-t border-phosphor/20 xl:w-[26rem] xl:border-t-0">
                    <h2 className="shrink-0 border-b border-phosphor/20 px-6 py-2.5 font-term text-sm uppercase tracking-label text-phosphor-mid">
                        Standings
                    </h2>

                    {leaderboard.length === 0 ? (
                        <p className="hatch flex flex-1 items-center justify-center px-6 font-term text-lg text-phosphor-mid">
                            No participants yet
                        </p>
                    ) : (
                        <ol className="min-h-0 flex-1 overflow-y-auto">
                            {leaderboard.map((entry, index) => (
                                <li
                                    key={entry.id}
                                    className="flex items-center gap-4 border-b border-phosphor/15 px-6 py-3.5 last:border-b-0"
                                >
                                    <span
                                        className={`flex size-8 shrink-0 items-center justify-center font-term text-base ${rankClass(index)}`}
                                    >
                                        {index + 1}
                                    </span>
                                    <span className="min-w-0 flex-1 truncate font-term text-lg text-phosphor-bright">
                                        {entry.name}
                                    </span>
                                    <span className="shrink-0 font-term text-lg text-phosphor">
                                        {money(entry.assets)}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AdminDisplay;
