export function validateUsername(username: string): { ok: boolean; error?: string } {
  const s = username?.trim() ?? "";
  if (s.length < 3) return { ok: false, error: "Username must be at least 3 characters" };
  if (!/^[a-zA-Z0-9._-]+$/.test(s)) return { ok: false, error: "Username contains invalid characters" };
  return { ok: true };
}


export function validatePassword(password: string): { ok: boolean; error?: string } {
  if (!password) return { ok: false, error: "Password required" };
  if (password.length < 4) return { ok: false, error: "Password must be at least 4 characters" };
  return { ok: true };
}


export function validateNote(title: string, body: string) {
  if (!title || title.trim().length === 0) return { ok: false, error: "Title is required" };
  if (!body || body.trim().length === 0) return { ok: false, error: "Body is required" };
  return { ok: true };
}
