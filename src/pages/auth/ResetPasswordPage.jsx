import { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperInput from "../../components/paper/PaperInput.jsx";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import PaperStamp from "../../components/paper/PaperStamp.jsx";
import { authApi } from "../../lib/authApi.js";
import { ApiError } from "../../lib/api.js";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetToken } = useSearch({ strict: false });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!resetToken) {
      setError("This reset link is missing its token. Request a new one.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await authApi.resetPassword(resetToken, newPassword, confirmPassword);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <PaperPanel className="torn-edges bg-paper-1 shadow-lift" bodyClassName="px-6 py-8 sm:px-10 sm:py-10">
        <div className="text-center">
          <PaperStamp tone="kraft">The Paper Desk</PaperStamp>
          <p className="mt-5 font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-kraft">
            a fresh start
          </p>
          <h1 className="mt-1 font-hand text-5xl leading-none text-ink-1">Set a new password</h1>
        </div>

        {done ? (
          <div className="mt-8 border border-dashed border-kraft/60 bg-paper-2 px-5 py-6 text-center">
            <PaperStamp tone="green" animate>filed successfully</PaperStamp>
            <p className="mt-4 font-display text-sm leading-relaxed text-ink-2">
              Your password has been reset.
            </p>
            <PaperButton as={Link} to="/login" variant="stamp" className="mt-5">
              Return to login
            </PaperButton>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-5">
            <PaperInput
              label="New password"
              type="password"
              minLength={8}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
            <PaperInput
              label="Confirm new password"
              type="password"
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            {error && (
              <p role="alert" className="rotate-[-0.4deg] font-hand text-lg leading-tight text-ink-red">
                ↳ {error}
              </p>
            )}
            <PaperButton type="submit" variant="stamp" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Filing…" : "Reset password"}
            </PaperButton>
          </form>
        )}
      </PaperPanel>
    </div>
  );
}
