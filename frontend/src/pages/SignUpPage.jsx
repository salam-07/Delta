import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import AuthLayout from "../layouts/AuthLayout";
import { Button } from "../components/ui/Button";
import { PasswordField, TextField } from "../components/ui/Field";
import { money } from "../lib/format";

const BLANK = { fullName: "", email: "", password: "" };

/** The balance every new account opens with. See the user model's default. */
const STARTING_CASH = 3000;

const MIN_PASSWORD = 4;

/** Create an account and join the competition. */
const SignUpPage = () => {
    const [form, setForm] = useState(BLANK);
    const { signup, isSigningUp } = useAuthStore();

    const setField = (name) => (e) => setForm((prev) => ({ ...prev, [name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.fullName.trim()) return toast.error("Enter your full name");
        if (!form.email.trim()) return toast.error("Enter your email address");
        if (!/\S+@\S+\.\S+/.test(form.email)) return toast.error("That email address is not valid");
        if (!form.password) return toast.error("Choose a password");
        if (form.password.length < MIN_PASSWORD) {
            return toast.error(`Your password needs at least ${MIN_PASSWORD} characters`);
        }

        const created = await signup({
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            password: form.password,
        });

        if (!created) setForm((prev) => ({ ...prev, password: "" }));
    };

    return (
        <AuthLayout
            title="Create account"
            purpose={`You start with ${money(STARTING_CASH)} in cash and trade against everyone else on the floor.`}
            footer={
                <>
                    Already registered?{" "}
                    <Link to="/login" className="text-phosphor underline-offset-4 hover:underline">
                        Sign in
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <TextField
                    label="Full name"
                    value={form.fullName}
                    onChange={setField("fullName")}
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                    hint="Shown on the leaderboard and the floor display."
                    autoFocus
                />

                <TextField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={setField("email")}
                    placeholder="you@example.com"
                    autoComplete="email"
                />

                <PasswordField
                    label="Password"
                    value={form.password}
                    onChange={setField("password")}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    hint={`At least ${MIN_PASSWORD} characters.`}
                />

                <Button type="submit" variant="primary" size="lg" loading={isSigningUp} className="w-full">
                    Create account
                </Button>
            </form>
        </AuthLayout>
    );
};

export default SignUpPage;
