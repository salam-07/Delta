import { useState, useEffect } from 'react';
import {
    ChartLine,
    CircleDollarSign,
    CircleQuestionMark,
    FileText,
    History,
    Landmark,
    Menu,
} from 'lucide-react';
import AppSidebar from "../components/AppSidebar";
import { useAuthStore } from '../store/useAuthStore';
import { useMarketStore } from '../store/useMarketStore';
import { useTradeStore } from '../store/useTradeStore';

const NAV_ITEMS = [
    { id: 'market', label: 'Market', icon: Landmark, path: '/user', exact: true },
    { id: 'portfolio', label: 'Portfolio', icon: CircleDollarSign, path: '/user/portfolio' },
    { id: 'trade', label: 'Trade', icon: ChartLine, path: '/user/trade' },
    { id: 'developments', label: 'Developments', icon: FileText, path: '/user/developments' },
    { id: 'history', label: 'History', icon: History, path: '/user/history' },
    { id: 'help', label: 'Help', icon: CircleQuestionMark, path: '/user/help' },
];

/**
 * The participant shell. `title` names the page in its own header row — it used
 * to be accepted and thrown away, leaving every page to invent its own heading.
 * `actions` is the header's right-hand control slot.
 */
const UserLayout = ({ children, title = "Market", actions = null }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { authUser } = useAuthStore();
    const { fetchMarketStatus } = useMarketStore();
    const { checkBalance, viewPortfolio } = useTradeStore();

    // Initialize data on mount
    useEffect(() => {
        checkBalance();
        viewPortfolio();
        fetchMarketStatus();
    }, [checkBalance, viewPortfolio, fetchMarketStatus]);

    return (
        <div className="flex h-full">
            <AppSidebar
                items={NAV_ITEMS}
                accountName={authUser?.fullName}
                roleLabel="Participant"
                footnote="© 2025 Delta™. Developed by Abdus Salam."
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-14 shrink-0 items-center gap-3 border-b border-phosphor/20 px-4 sm:px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="-ml-2 p-2 text-phosphor-mid transition-colors hover:text-phosphor-bright lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="size-5" aria-hidden="true" />
                    </button>
                    <h1 className="truncate font-term text-sm uppercase tracking-label text-phosphor-bright">
                        {title}
                    </h1>
                    {actions ? <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div> : null}
                </header>

                <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserLayout;
