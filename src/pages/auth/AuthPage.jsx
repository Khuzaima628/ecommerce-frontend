import { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperInput, { PaperSelect as RoleSelect } from "../../components/paper/PaperInput.jsx";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import PaperStamp from "../../components/paper/PaperStamp.jsx";
import { authApi } from "../../lib/authApi.js";
import { ApiError } from "../../lib/api.js";

const CONTENT = {
  signup: {
    eyebrow: "open a new drawer",
    title: "Join the day book",
    description: "Leave your name on the desk and we’ll keep a place for you among the makers and collectors.",
  },
  verify: {
    eyebrow: "a small confirmation",
    title: "Check the post",
    description: "Enter the six-digit code sent to your inbox.",
  },
  forgot: {
    eyebrow: "lost among the papers",
    title: "Find your way back",
    description: "Tell us where to send a fresh code and we’ll put it in the next envelope out.",
  },
  "forgot-verify": {
    eyebrow: "a small confirmation",
    title: "Check the post",
    description: "Enter the six-digit code we sent to confirm it's you.",
  },
};

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const content = CONTENT[mode];

  const [email, setEmail] = useState(search?.email ?? "");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await authApi.signup({ name: name.trim(), email: email.trim(), password, role });
        navigate({ to: "/verify", search: { email: email.trim() } });
        return;
      }

      if (mode === "verify") {
        await authApi.verifyOtp(email.trim(), code);
        navigate({ to: "/login" });
        return;
      }

      if (mode === "forgot") {
        await authApi.forgotPassword(email.trim());
        navigate({ to: "/forgot-password/verify", search: { email: email.trim() } });
        return;
      }

      if (mode === "forgot-verify") {
        const { resetToken } = await authApi.verifyForgotPasswordOtp(email.trim(), code);
        navigate({ to: "/reset-password", search: { resetToken } });
        return;
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <aside className="relative hidden min-h-[42rem] overflow-hidden bg-ink-2 px-7 py-9 text-paper-1 shadow-lift [clip-path:polygon(0_1%,98%_0,100%_3%,99%_97%,96%_100%,2%_98%,0_94%)] sm:px-10 lg:block">
        <span aria-hidden="true" className="paper-grain opacity-15" />
        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-paper-1/65">
                The Paper Desk
              </p>
              <h2 className="mt-2 font-hand text-6xl leading-[0.82] text-paper-1">
                A better sort
                <br />
                of market.
              </h2>
            </div>
            <img
              src="/58dfe6a3-3c4d-4f86-a077-0377ed7d4c31_removalai_preview.png"
              alt=""
              className="h-20 w-20 rotate-[8deg] object-contain opacity-90"
            />
          </div>

          <div className="my-auto py-12">
            <p className="max-w-md font-display text-xl italic leading-relaxed text-paper-1/80">
              Handmade goods, small stubborn tools, and the makers who still care how things feel
              in the hand.
            </p>
          </div>

          <div className="flex items-end justify-between gap-4 border-t border-dashed border-paper-1/25 pt-4">
            <p className="max-w-xs font-hand text-2xl leading-none text-paper-1/75">
              Take your time.
              <br />
              The good stuff is here.
            </p>
            <PaperStamp tone="kraft">Est. 1984</PaperStamp>
          </div>
        </div>
      </aside>

      <div className="min-h-[42rem] [clip-path:polygon(1%_0,98%_1%,100%_4%,99%_96%,97%_100%,2%_99%,0_96%,1%_3%)]">
        <PaperPanel className="torn-edges bg-paper-1 shadow-lift" bodyClassName="px-6 py-8 sm:px-10 sm:py-10">
          <div className="text-center">
            <PaperStamp tone="kraft">The Paper Desk</PaperStamp>
            <p className="mt-5 font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-kraft">
              {content.eyebrow}
            </p>
            <h1 className="mt-1 font-hand text-5xl leading-none text-ink-1">{content.title}</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-3">
              {content.description}
            </p>
          </div>

          {sent ? (
            <div className="mt-8 border border-dashed border-kraft/60 bg-paper-2 px-5 py-6 text-center">
              <PaperStamp tone="green" animate>filed successfully</PaperStamp>
              <p className="mt-4 font-display text-sm leading-relaxed text-ink-2">
                Your request has been noted.
              </p>
              <PaperButton as={Link} to="/login" variant="stamp" className="mt-5">
                Return to login
              </PaperButton>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-5">
              {mode === "signup" && (
                <>
                  <PaperInput
                    label="Your name"
                    placeholder="Nadia Farooq"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                  <RoleSelect
                    label="I am a"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    required
                  >
                    <option value="customer">Customer — here to shop</option>
                    <option value="seller">Seller — here to sell</option>
                  </RoleSelect>
                </>
              )}
              {(mode === "signup" || mode === "forgot") && (
                <PaperInput
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              )}
              {(mode === "verify" || mode === "forgot-verify") && (
                <PaperInput
                  label="Six-digit code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                  hint={email ? `Sent to ${email}` : undefined}
                  required
                />
              )}
              {mode === "signup" && (
                <PaperInput
                  label="Password"
                  type="password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              )}
              {error && (
                <p role="alert" className="-rotate-[0.4deg] font-hand text-lg leading-tight text-ink-red">
                  ↳ {error}
                </p>
              )}
              <PaperButton type="submit" variant="stamp" size="lg" className="w-full" disabled={submitting}>
                {submitting
                  ? "Filing…"
                  : mode === "signup"
                    ? "Create my account"
                    : mode === "verify" || mode === "forgot-verify"
                      ? "Verify code"
                      : "Send reset code"}
              </PaperButton>
            </form>
          )}

          <div className="mt-7 flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-dashed border-paper-edge pt-5 text-sm text-ink-3">
            {mode === "signup" ? (
              <>
                <span>Already have a place?</span>
                <Link to="/login" className="font-semibold text-ink-red hover:ink-underline">Sign in</Link>
              </>
            ) : mode === "forgot" || mode === "forgot-verify" ? (
              <>
                <Link to="/login" className="font-semibold text-ink-red hover:ink-underline">Back to login</Link>
                <span aria-hidden="true">·</span>
                <Link to="/signup" className="font-semibold text-ink-red hover:ink-underline">Create an account</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="font-semibold text-ink-red hover:ink-underline">Back to login</Link>
                <span aria-hidden="true">·</span>
                <Link to="/forgot-password" className="font-semibold text-ink-red hover:ink-underline">Need a new code?</Link>
              </>
            )}
          </div>
        </PaperPanel>
      </div>
    </div>
  );
}
