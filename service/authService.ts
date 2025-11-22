import { load, save } from "../utils/storage";

export type UserRecord = {
  id: string;      // unique id for the user(we'll generate)
  username: string;   // unique username (required)
  password: string;   //hash them for production 
  createdAt: number;  // timestamp
};

//single AsyncStorage key USERS_LIST_V1 that contains an array of users.
const USERS_KEY = "USERS_LIST_V1";

async function readAllUsers(): Promise<UserRecord[]> {
  const stored = await load<UserRecord[]>(USERS_KEY);
  return stored ?? []; // return array or empty array
}


//registerUser

export async function registerUser({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<{ ok: true; user: UserRecord } | { ok: false; error: string }> {

  // read existing users
  const users = await readAllUsers();

    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { ok: false, error: "Username already exists" };
  }

  // create user object
  const user: UserRecord = {
    id: Math.random().toString(36).slice(2, 9), // small random id 
    username,
    password,                                   // plain text (demo only) hash in production
    createdAt: Date.now(),
  };

   users.push(user);
  await save(USERS_KEY, users);

  return { ok: true, user };
}

//loginUser

export async function loginUser({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<{ ok: true; user: UserRecord } | { ok: false; error: string }> {
  const users = await readAllUsers();

  // find by username "case-insensitive"
  const found = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );

  // not found or wrong password 
  if (!found) return { ok: false, error: "User not found" };
  if (found.password !== password) return { ok: false, error: "Invalid password" };

  return { ok: true, user: found };
}


export async function getUserById(id: string) {
  const users = await readAllUsers();
  return users.find((u) => u.id === id) ?? null;
}