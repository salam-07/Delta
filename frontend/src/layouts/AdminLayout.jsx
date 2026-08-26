import { useEffect, useState } from 'react';
import {
    BarChart3,
    ChartPie,
    FileText,
    Home,
    Menu,
    Presentation,
    Settings,
    TrendingUp,
    Users,
} from 'lucide-react';
import AppSidebar from '../components/AppSidebar';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketStore } from '../store/useMarketStore';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: Home, path: '/admin', exact: true },
    { id: 'users', label: 'Participants', icon: Users, path: '/admin/users' },
    { id: 'stocks', label: 'Stocks', icon: TrendingUp, path: '/admin/stocks' },
    { id: 'trades', label: 'Trades', icon: BarChart3, path: '/admin/trades' },
    { id: 'developments', label: 'Developments', icon: FileText, path: '/admin/developments' },
    { id: 'analytics', label: 'Analytics', icon: ChartPie, path: '/admin/analytics' },
    { id: 'display', label: 'Display Screen', icon: Presentation, path: '/admin/display' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

/**
 * The administrator shell. Same header contract as the participant shell:
 * `title` names the page, `actions` holds its controls.
 */
const AdminLayout = ({ children, title = "Overview", actions = null }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { authUser } = useAuthStore();
    const { fetchMarketStatus } = useMarketStore();

    useEffect(() => {
        fetchMarketStatus();
    }, [fetchMarketStatus]);

    return (
        <div className="flex h-full">
            <AppSidebar
                items={NAV_ITEMS}
                accountName={authUser?.fullName}
                roleLabel="Administrator"
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

export default AdminLayout;
