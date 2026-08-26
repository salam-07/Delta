import { Link } from "react-router-dom";
import { Panel } from "../components/ui/Panel";

/**
 * The gate: one panel on ink, centred, for the two pages that stand between a
 * visitor and the terminal.
 *
 * `delta-app` is set here rather than on the shared unauthenticated wrapper in
 * App.jsx, because the landing page sits in that same wrapper and owns its own
 * world. The two auth pages were ~120 near-identical lines of daisyUI apart,
 * which is how they drifted: only one of them validated its form.
 */
const AuthLayout = ({ title, purpose, children, footer }) => (
    <div className="delta-app flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
            <Panel ticks as="main">
                <header className="border-b border-phosphor/20 px-6 py-6 text-center">
                    <Link
                        to="/"
                        className="font-board text-2xl tracking-cell text-phosphor transition-colors hover:text-phosphor-bright"
                    >
                        DELTA
                    </Link>
                    <h1 className="mt-4 font-term text-sm uppercase tracking-label text-phosphor-bright">
                        {title}
                    </h1>
                    <p className="mt-1.5 font-term text-xs leading-relaxed text-phosphor-mid">{purpose}</p>
                </header>

                <div className="px-6 py-6">{children}</div>

                <footer className="border-t border-phosphor/20 bg-ink-raised px-6 py-3.5 text-center font-term text-xs text-phosphor-mid">
                    {footer}
                </footer>
            </Panel>
        </div>
    </div>
);

export default AuthLayout;
