import { useCallback } from "react";
import useAuthStore from "../store/authStore";
import { validateUsername, validatePassword } from "../utils/validators";


export function useAuth() {
  const user = useAuthStore((s) => s.user);                // current user
  const loading = useAuthStore((s) => s.loading);          // loading flag
  const login = useAuthStore((s) => s.login);              // login action
  const signup = useAuthStore((s) => s.signup);            // signup action
  const logout = useAuthStore((s) => s.logout);            // logout action

 
  const signIn = useCallback(async (username: string, password: string) => {
    const vUser = validateUsername(username);
    if (!vUser.ok) return { ok: false, error: vUser.error };
    const vPass = validatePassword(password);
    if (!vPass.ok) return { ok: false, error: vPass.error };
    return await login(username, password);
  }, [login]);

  
  const signUp = useCallback(async (username: string, password: string) => {
    const vUser = validateUsername(username);
    if (!vUser.ok) return { ok: false, error: vUser.error };
    const vPass = validatePassword(password);
    if (!vPass.ok) return { ok: false, error: vPass.error };
    return await signup(username, password);
  }, [signup]);

  return {
    user,
    loading,
    signIn,
    signUp,
    logout,
  };
}

export default useAuth;
