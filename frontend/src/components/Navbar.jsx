import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useMarketStore } from "../store/useMarketStore";
import { useTradeStore } from "../store/useTradeStore";
import { Lamp } from "./ui/Feedback";
import { clockTime, money } from "../lib/format";

/**
 * The application's status bar — sibling to the landing terminal's own chrome:
 * identity on the left, live session state on the right, one hairline below.
 *
 * It is the only persistent bar in the product. Market state and a participant's
 * cash and net worth are session facts, not page facts, so they live here and
 * stay on screen while pages change beneath them.
 */
const Navbar = () => {
    const { logout, authUser, isAdmin } = useAuthStore();
    const { marketOpen } = useMarketStore();
    const { balance, getTotalAssets, isLoadingBalance, isLoadingPortfolio } = useTradeStore();
    const [now, setNow] = useState(clockTime);

    useEffect(() => {
        const id = setInterval(() => setNow(clockTime()), 1000);
        return () => clearInterval(id);
    }, []);

    const isParticipant = Boolean(authUser) && !isAdmin;
    const netWorth = getTotalAssets();

    return (
        <header className="z-40 h-10 shrink-0 border-b border-phosphor/35 bg-ink">
            <div className="flex h-full items-center gap-3 px-3 font-term text-[10px] uppercase tracking-label sm:px-5">
                <Link
                    to="/"
                    className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80"
                    aria-label="Delta home"
                >
                    <img src="/logo.svg" alt="" className="size-4 shrink-0" />
                    <span className="font-board text-[16px] tracking-cell text-phosphor">DELTA</span>
                </Link>
                <span className="hidden text-phosphor-dim sm:inline" aria-hidden="true">
                    |
                </span>
                <span className="hidden truncate text-phosphor-mid sm:inline">
                    {isAdmin ? "Market Control" : "Trading Simulation"}
                </span>

                <div className="ml-auto flex items-center gap-3 sm:gap-5">
                    {isParticipant ? (
                        <>
                            <span className="hidden items-baseline gap-2 md:flex">
                                <span className="text-signal-cyanDim">Net</span>
                                <span className="text-phosphor-bright">
                                    {isLoadingBalance || isLoadingPortfolio ? "——" : money(netWorth)}
                                </span>
                            </span>
                            <span className="hidden items-baseline gap-2 sm:flex">
                                <span className="text-signal-cyanDim">Cash</span>
                                <span className="text-phosphor-bright">
                                    {isLoadingBalance ? "——" : money(balance)}
                                </span>
                            </span>
                        </>
                    ) : null}

                    <span className="flex items-center gap-1.5">
                        <Lamp on={marketOpen} />
                        <span className={marketOpen ? "text-signal-up" : "text-signal-down"}>
                            {marketOpen ? "Open" : "Closed"}
                        </span>
                    </span>

                    <span className="hidden text-phosphor-bright sm:inline">{now}</span>

                    {authUser ? (
                        <button
                            onClick={logout}
                            className="-mr-2 flex items-center gap-2 px-2 py-1.5 font-term text-[10px] uppercase tracking-label text-phosphor-mid transition-colors hover:bg-phosphor/10 hover:text-phosphor-bright"
                        >
                            <LogOut className="size-3.5 shrink-0" aria-hidden="true" />
                            <span className="hidden sm:inline">Sign out</span>
                        </button>
                    ) : null}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
