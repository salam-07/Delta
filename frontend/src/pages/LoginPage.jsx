import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import AuthLayout from "../layouts/AuthLayout";
import { Button } from "../components/ui/Button";
import { PasswordField, TextField } from "../components/ui/Field";

const BLANK = { email: "", password: "" };

/**
 * Sign in.
 *
 * The form now checks itself before posting. It had no validation at all, so an
 * empty submit went to the server and came back as a generic rejection — the
 * signup page next door had checked the same two fields all along.
 */
const LoginPage = () => {
    const [form, setForm] = useState(BLANK);
    const { login, isLoggingIn } = useAuthStore();

    const setField = (name) => (e) => setForm((prev) => ({ ...prev, [name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email.trim()) return toast.error("Enter your email address");
        if (!form.password) return toast.error("Enter your password");

        const signedIn = await login({ email: form.email.trim(), password: form.password });

        // Only the password is cleared on failure. Retyping an email that was
        // probably right is busywork; leaving a rejected password in the box is
        // worse than blanking it.
        if (!signedIn) setForm((prev) => ({ ...prev, password: "" }));
    };

    return (
        <AuthLayout
            title="Sign in"
            purpose="Your account carries your cash, your positions and your standing."
            footer={
                <>
                    No account yet?{" "}
                    <Link to="/signup" className="text-phosphor underline-offset-4 hover:underline">
                        Create one
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <TextField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={setField("email")}
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
                />

                <PasswordField
                    label="Password"
                    value={form.password}
                    onChange={setField("password")}
                    placeholder="••••••••"
                    autoComplete="current-password"
                />

                <Button type="submit" variant="primary" size="lg" loading={isLoggingIn} className="w-full">
                    Sign in
                </Button>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;
