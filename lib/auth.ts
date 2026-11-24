// Comptes et connexion, sans back-end : tout est enregistré dans IndexedDB (voir lib/db.ts).
// Le mot de passe n'est jamais gardé en clair : on enregistre seulement son empreinte (hash SHA-256 + sel).
// On peut s'inscrire et se connecter avec une adresse e-mail OU un numéro de téléphone.
import { loadItem, saveItem } from "@/lib/db";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string; // rempli si la personne s'est inscrite avec une adresse e-mail
  phone?: string; // rempli si la personne s'est inscrite avec un numéro de téléphone
  salt: string;
  passwordHash: string;
  photo?: string;
};

type Result = { ok: boolean; error?: string; user?: User };

// --- Reconnaître une adresse e-mail ou un numéro de téléphone ---

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// Numéro valide : chiffres, espaces, tirets, points, parenthèses, + au début. Entre 8 et 15 chiffres.
export function isPhone(value: string): boolean {
  const text = value.trim();
  const digits = text.replace(/\D/g, "");
  return /^\+?[\d\s().-]+$/.test(text) && digits.length >= 8 && digits.length <= 15;
}

// Garde seulement les chiffres (et le + du début) : "+229 51 86 72 81" -> "+22951867281"
function cleanPhone(value: string): string {
  const text = value.trim();
  return (text.startsWith("+") ? "+" : "") + text.replace(/\D/g, "");
}

// Deux numéros sont les mêmes si l'un finit par l'autre : "51867281" et "+22951867281"
function samePhone(a: string, b: string): boolean {
  const da = a.replace(/\D/g, "");
  const db = b.replace(/\D/g, "");
  if (Math.min(da.length, db.length) < 8) return false;
  return da.endsWith(db) || db.endsWith(da);
}

function findUser(users: User[], identifier: string): User | undefined {
  const value = identifier.trim();
  if (isEmail(value)) {
    const email = value.toLowerCase();
    return users.find((u) => u.email === email);
  }
  return users.find((u) => u.phone !== undefined && samePhone(u.phone, value));
}

// --- Mot de passe ---

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function newSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return toHex(bytes.buffer);
}

async function hashPassword(password: string, salt: string): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Ouvre le site sur localhost ou en https pour pouvoir créer un compte.");
  }
  const data = new TextEncoder().encode(salt + password);
  return toHex(await crypto.subtle.digest("SHA-256", data));
}

// --- Comptes ---

async function getUsers(): Promise<User[]> {
  return (await loadItem<User[]>("users")) ?? [];
}

// Crée un compte, puis connecte directement la personne
export async function registerUser(input: {
  firstName: string;
  lastName: string;
  identifier: string; // adresse e-mail ou numéro de téléphone
  password: string;
}): Promise<Result> {
  const value = input.identifier.trim();
  const users = await getUsers();
  if (findUser(users, value)) {
    return { ok: false, error: "Cette adresse e-mail ou ce numéro est déjà utilisé." };
  }
  const salt = newSalt();
  const user: User = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    ...(isEmail(value) ? { email: value.toLowerCase() } : { phone: cleanPhone(value) }),
    salt,
    passwordHash: await hashPassword(input.password, salt),
  };
  await saveItem("users", [...users, user]);
  await saveItem("session", user.id);
  return { ok: true, user };
}

// Vérifie l'identifiant (e-mail ou téléphone) et le mot de passe, puis ouvre la session
export async function loginUser(identifier: string, password: string): Promise<Result> {
  const users = await getUsers();
  const user = findUser(users, identifier);
  if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) {
    return { ok: false, error: "L’adresse e-mail, le numéro ou le mot de passe est incorrect." };
  }
  await saveItem("session", user.id);
  return { ok: true, user };
}

// Renvoie la personne actuellement connectée (undefined si personne)
export async function getCurrentUser(): Promise<User | undefined> {
  const id = await loadItem<string>("session");
  if (!id) return undefined;
  const users = await getUsers();
  return users.find((u) => u.id === id);
}

export async function logoutUser(): Promise<void> {
  await saveItem("session", "");
}

export async function updateUserPhoto(id: string, photo: string): Promise<void> {
  const users = await getUsers();
  await saveItem(
    "users",
    users.map((u) => (u.id === id ? { ...u, photo } : u))
  );
}
