import { useCallback, useEffect, useMemo, useState } from "react";
import { getMe, loginUser, registerUser } from "../api/authApi";
import { AuthContext } from "./authContextInstance";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("billify_token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await getMe();
        setUser(data.user);
      } catch {
        localStorage.removeItem("billify_token");
        setToken("");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const saveAuth = useCallback((authToken, authUser) => {
    localStorage.setItem("billify_token", authToken);
    setToken(authToken);
    setUser(authUser);
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await registerUser(payload);
    saveAuth(data.token, data.user);
    return data;
  }, [saveAuth]);

  const login = useCallback(async (payload) => {
    const { data } = await loginUser(payload);
    saveAuth(data.token, data.user);
    return data;
  }, [saveAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem("billify_token");
    setToken("");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, loading, setUser, register, login, logout, isAuthenticated: Boolean(token) }),
    [token, user, loading, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
