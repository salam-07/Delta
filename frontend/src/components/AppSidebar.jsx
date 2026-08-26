import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { initial } from "../lib/format";

/**
 * The application's navigation rail. One component for both portals — the
 * participant and administrator rails were byte-for-byte identical apart from
 * their item lists, so the list is the only thing either side supplies.
 *
 * The active destination is marked with a lit cell in the row's own gutter,
 * the way a terminal menu carries its cursor.
 */
const AppSidebar = ({ items, accountName, roleLabel, footnote, sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();

    const isActiveRoute = (path, exact) =>
        exact ? location.pathname === path : location.pathname.startsWith(path);

    return (
        <>
            {sidebarOpen ? (
                <div
                    className="fixed bottom-0 left-0 right-0 top-10 z-30 bg-ink/80 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            ) : null}

            <div
                className={`fixed bottom-0 left-0 top-10 z-30 flex w-60 flex-col border-r border-phosphor/20 bg-ink-panel
                    transition-transform duration-200 ease-out lg:static lg:translate-x-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex h-11 shrink-0 items-center justify-between border-b border-phosphor/20 px-4 lg:hidden">
                    <span className="font-term text-[10px] uppercase tracking-label text-phosphor-mid">Menu</span>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="-mr-2 p-2 text-phosphor-mid transition-colors hover:text-phosphor-bright"
                        aria-label="Close menu"
                    >
                        <X className="size-4" aria-hidden="true" />
                    </button>
                </div>

                <nav aria-label={roleLabel} className="min-h-0 flex-1 overflow-y-auto py-3">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = isActiveRoute(item.path, item.exact);
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                aria-current={isActive ? "page" : undefined}
                                className={`flex items-center gap-3 px-4 py-2.5 font-term text-[11px] uppercase tracking-[0.1em] transition-colors duration-100
                                    ${isActive
                                        ? "bg-phosphor/10 text-phosphor-bright"
                                        : "text-phosphor-mid hover:bg-phosphor/5 hover:text-phosphor-bright"
                                    }`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`size-1.5 shrink-0 ${isActive ? "bg-phosphor" : "bg-phosphor-dim/50"}`}
                                />
                                <Icon
                                    className={`size-4 shrink-0 ${isActive ? "text-phosphor" : ""}`}
                                    strokeWidth={1.75}
                                    aria-hidden="true"
                                />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="shrink-0 border-t border-phosphor/20 px-4 py-4">
                    <div className="flex items-center gap-3">
                        <span
                            className="flex size-8 shrink-0 items-center justify-center border border-phosphor/40 bg-phosphor/10 font-term text-xs text-phosphor"
                            aria-hidden="true"
                        >
                            {initial(accountName)}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate font-term text-xs text-phosphor-bright">{accountName || "—"}</p>
                            <p className="font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                {roleLabel}
                            </p>
                        </div>
                    </div>
                    {footnote ? (
                        <p className="mt-4 font-term text-[10px] leading-relaxed text-phosphor-mid/80">{footnote}</p>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default AppSidebar;
