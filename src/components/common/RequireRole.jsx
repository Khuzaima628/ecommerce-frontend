import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSession, HOME_FOR_ROLE } from "../../context/SessionContext.jsx";

/**
 * Mock route protection based on the role held in session state.
 *
 * This deliberately does NOT render `<Navigate>`. Rendering a redirect
 * as a component means React commits and paints the guarded page first
 * and only redirects afterwards, which showed the previous role's
 * dashboard for a beat before the right one replaced it.
 *
 * Instead the redirect is fired in an effect and the guard renders a
 * neutral holding sheet in the meantime, so a page the visitor is not
 * allowed to see is never painted at all.
 */
export default function RequireRole({ role, children }) {
  const { currentUser, bootstrapping } = useSession();
  const navigate = useNavigate();

  const allowed = Boolean(currentUser) && currentUser.role === role;
  const destination = !currentUser ? "/login" : HOME_FOR_ROLE[currentUser.role];

  useEffect(() => {
    if (bootstrapping || allowed) return;
    navigate({ to: destination, replace: true });
  }, [bootstrapping, allowed, destination, navigate]);

  if (bootstrapping || !allowed) return <RouteHold />;
  return children;
}

/** A blank sheet held up while the redirect resolves. */
function RouteHold() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <p className="font-hand text-2xl text-paper-2/70">Turning the page…</p>
    </div>
  );
}
