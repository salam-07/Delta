import { Link } from "react-router-dom";
import { Presentation } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAuthStore } from "../../store/useAuthStore";
import { Panel, PanelHeader } from "../../components/ui/Panel";
import { Button } from "../../components/ui/Button";
import { money } from "../../lib/format";

/**
 * Settings: what this administrator is signed in as, and the competition
 * constants that are fixed in code.
 *
 * This page was the word "Settings" in a `<div>` behind a sidebar entry that
 * promised a page. Nothing here is editable, and it says so rather than
 * offering controls that have no endpoint behind them.
 */

/** Facts read from the models and controllers, not configuration. */
const RULES = [
    {
        label: "Opening balance",
        value: money(3000),
        note: "Every new participant account starts here.",
    },
    {
        label: "Price floor",
        value: money(0.01),
        note: "A listing's price cannot be adjusted below this.",
    },
    {
        label: "Development targets",
        value: "Applied on publish",
        note: "A development's prices are set the moment it goes on the wire, not when it is drafted.",
    },
];

const AdminSettings = () => {
    const { authUser } = useAuthStore();

    const account = [
        { label: "Name", value: authUser?.fullName || "—" },
        { label: "Email", value: authUser?.email || "—" },
        { label: "Role", value: "Administrator" },
    ];

    return (
        <AdminLayout title="Settings">
            <div className="mx-auto max-w-3xl space-y-6">
                <Panel ticks>
                    <PanelHeader label="Signed in as" />
                    <dl>
                        {account.map((row) => (
                            <div
                                key={row.label}
                                className="flex items-baseline justify-between gap-6 border-b border-phosphor/15 px-4 py-3 last:border-b-0"
                            >
                                <dt className="shrink-0 font-term text-[11px] uppercase tracking-label text-phosphor-mid">
                                    {row.label}
                                </dt>
                                <dd className="min-w-0 truncate font-term text-sm text-phosphor-bright">
                                    {row.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <footer className="border-t border-phosphor/20 bg-ink-raised px-4 py-3">
                        <p className="font-term text-[11px] leading-relaxed text-phosphor-mid">
                            Administrator accounts are created directly in the database. There is no endpoint to
                            change these from the product, so nothing here is editable.
                        </p>
                    </footer>
                </Panel>

                <Panel>
                    <PanelHeader label="Competition rules" />
                    <dl>
                        {RULES.map((rule) => (
                            <div
                                key={rule.label}
                                className="border-b border-phosphor/15 px-4 py-3 last:border-b-0"
                            >
                                <div className="flex items-baseline justify-between gap-6">
                                    <dt className="shrink-0 font-term text-[11px] uppercase tracking-label text-phosphor-mid">
                                        {rule.label}
                                    </dt>
                                    <dd className="font-term text-sm text-phosphor-bright">{rule.value}</dd>
                                </div>
                                <p className="mt-1 font-term text-[11px] leading-relaxed text-phosphor-mid">
                                    {rule.note}
                                </p>
                            </div>
                        ))}
                    </dl>
                    <footer className="border-t border-phosphor/20 bg-ink-raised px-4 py-3">
                        <p className="font-term text-[11px] leading-relaxed text-phosphor-mid">
                            These are set in code. Changing one is a deployment, not a setting.
                        </p>
                    </footer>
                </Panel>

                <Panel>
                    <PanelHeader label="Floor display" />
                    <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-md font-term text-xs leading-relaxed text-phosphor-mid">
                            A read-only board for the room: live prices, the tape and the standings, sized to be read
                            from across a hall. Open it on the projector and leave it running.
                        </p>
                        <Button as={Link} to="/admin/display" variant="default" className="sm:w-40">
                            <Presentation className="size-3.5 shrink-0" aria-hidden="true" />
                            Open display
                        </Button>
                    </div>
                </Panel>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
