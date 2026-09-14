import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSession, HOME_FOR_ROLE } from "../context/SessionContext.jsx";
import { ApiError } from "../lib/api.js";
import AuthShowcase from "../components/common/AuthShowcase.jsx";
import PaperButton from "../components/paper/PaperButton.jsx";
import PaperInput from "../components/paper/PaperInput.jsx";
import PaperStamp from "../components/paper/PaperStamp.jsx";

export default function LoginPage() {
  const { login } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(email.trim(), password);
      navigate({ to: HOME_FOR_ROLE[user.role] ?? "/" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <AuthShowcase />
      <div className="min-h-[42rem] [clip-path:polygon(1%_0,98%_1%,100%_4%,99%_96%,97%_100%,2%_99%,0_96%,1%_3%)]">
        <div className="torn-edges relative h-full bg-paper-1 px-6 py-8 shadow-lift sm:px-10 sm:py-10">
          <span aria-hidden="true" className="paper-grain" />
          <div className="relative text-center">
            <PaperStamp tone="kraft">sign the day book</PaperStamp>
            <h1 className="mt-5 font-hand text-5xl leading-none text-ink-1">Welcome back</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-3">
              Sign in to return to your stall, your saved goods, or the platform ledger.
            </p>
          </div>

          <form onSubmit={submit} className="relative mx-auto mt-9 max-w-md space-y-5">
            <PaperInput
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <PaperInput
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              error={error}
            />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm font-semibold text-ink-red hover:ink-underline">
                Forgot password?
              </Link>
            </div>
            <PaperButton type="submit" variant="stamp" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Opening…" : "Open my account"}
            </PaperButton>
          </form>

          <div className="relative mx-auto mt-8 max-w-md border-t border-dashed border-paper-edge pt-5 text-center text-sm text-ink-3">
            <p>
              New to the desk?{" "}
              <Link to="/signup" className="font-semibold text-ink-red hover:ink-underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
