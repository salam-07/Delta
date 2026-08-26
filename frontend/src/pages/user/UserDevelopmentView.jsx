import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useMarketStore } from "../../store/useMarketStore";
import UserLayout from "../../layouts/UserLayout";
import { Panel } from "../../components/ui/Panel";
import { Button } from "../../components/ui/Button";
import { ErrorPanel, LoadingPanel } from "../../components/ui/Feedback";
import { dateTime } from "../../lib/format";

/**
 * A single development, read in full.
 *
 * Read-only: the publish state is stated as a fact, not offered as a control.
 * The badge here used to carry `cursor-pointer` and a hover lift with no
 * handler behind it, promising participants an action they do not have.
 */
const UserDevelopmentView = () => {
    const { devId } = useParams();
    const { fetchDev, dev, isDevLoading } = useMarketStore();

    useEffect(() => {
        if (devId) fetchDev(devId);
    }, [devId, fetchDev]);

    const backToWire = (
        <Button as={Link} to="/user/developments" size="sm" variant="ghost">
            <ArrowLeft className="size-3 shrink-0" aria-hidden="true" />
            The wire
        </Button>
    );

    if (isDevLoading) {
        return (
            <UserLayout title="Development" actions={backToWire}>
                <Panel>
                    <LoadingPanel label="Loading development" />
                </Panel>
            </UserLayout>
        );
    }

    if (!dev) {
        return (
            <UserLayout title="Development" actions={backToWire}>
                <Panel>
                    <ErrorPanel
                        label="Development not found"
                        description="This development does not exist, has not been published, or has been withdrawn."
                        action={
                            <Button as={Link} to="/user/developments" variant="primary">
                                Back to the wire
                            </Button>
                        }
                    />
                </Panel>
            </UserLayout>
        );
    }

    return (
        <UserLayout title="Development" actions={backToWire}>
            <article className="mx-auto max-w-3xl space-y-6">
                <Panel ticks>
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
                            This development was published without a body.
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

                <p className="font-term text-[11px] leading-relaxed text-phosphor-mid">
                    Developments can move prices. Check the market board for the current quote before you trade on this.
                </p>
            </article>
        </UserLayout>
    );
};

export default UserDevelopmentView;
