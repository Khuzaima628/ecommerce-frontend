import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../lib/authApi.js";
import { getTokens, setTokens as persistTokens, ApiError } from "../lib/api.js";

const SessionContext = createContext(null);

// The backend keys users by _id; older mock-data pages still read .id — keep both in sync.
const withId = (user) => (user ? { ...user, id: user._id ?? user.id } : user);

export function SessionProvider({ children }) {
  const [currentUser, setCurrentUserRaw] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  const setCurrentUser = useCallback((next) => {
    setCurrentUserRaw((prev) =>
      withId(typeof next === "function" ? next(prev) : next),
    );
  }, []);

  // On load, if tokens exist, restore the session by calling get-me.
  useEffect(() => {
    const tokens = getTokens();
    if (!tokens?.accessToken) {
      setBootstrapping(false);
      return;
    }
    authApi
      .getMe()
      .then((user) => setCurrentUser(user))
      .catch(() => {
        persistTokens(null);
        setCurrentUser(null);
      })
      .finally(() => setBootstrapping(false));
  }, [setCurrentUser]);

  const login = useCallback(async (email, password) => {
    const { user, accessToken, refreshToken } = await authApi.login(email, password);
    persistTokens({ accessToken, refreshToken });
    setCurrentUser(user);
    return user;
  }, [setCurrentUser]);

  const logout = useCallback(() => {
    persistTokens(null);
    setCurrentUser(null);
  }, [setCurrentUser]);

  const refreshCurrentUser = useCallback(async () => {
    const user = await authApi.getMe();
    setCurrentUser(user);
    return user;
  }, [setCurrentUser]);

  const value = useMemo(
    () => ({
      currentUser,
      role: currentUser?.role ?? null,
      bootstrapping,
      login,
      logout,
      refreshCurrentUser,
      setCurrentUser,
    }),
    [currentUser, bootstrapping, login, logout, refreshCurrentUser, setCurrentUser],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}

export { ApiError };

export const HOME_FOR_ROLE = {
  customer: "/customer/products",
  seller: "/seller/dashboard",
  admin: "/admin/dashboard",
};
