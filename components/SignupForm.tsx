"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { isEmail, isPhone, registerUser } from "@/lib/auth";

const inputClass = "h-11 bg-white px-3 text-[15px] text-[#1C1E21]";

// Vrai s'il y a au moins un signe : ni lettre (accentuée ou non), ni chiffre, ni espace
const hasSymbol = (value: string) => /[^A-Za-z0-9À-ÿ\s]/.test(value);

export default function SignupForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim() || !identifier.trim() || !password || !confirm) {
      setError("Remplis tous les champs.");
      return;
    }
    const value = identifier.trim();
    if (value.includes("@") ? !isEmail(value) : !isPhone(value)) {
      setError(
        value.includes("@")
          ? "Entre une adresse e-mail valide."
          : "Entre un numéro de téléphone valide (8 chiffres minimum) ou une adresse e-mail."
      );
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (!hasSymbol(password)) {
      setError("Le mot de passe doit contenir au moins un signe (par exemple ! @ # &).");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne sont pas identiques.");
      return;
    }

    setBusy(true);
    try {
      const result = await registerUser({ firstName, lastName, identifier, password });
      if (!result.ok) {
        setError(result.error ?? "Inscription impossible.");
        setBusy(false);
        return;
      }
      router.push("/bienvenue"); // la personne est connectée directement
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Réessaie.");
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-[432px] rounded-lg bg-white shadow-lg">
      <div className="px-4 pb-1 pt-4">
        <h1 className="text-[26px] font-bold leading-8 text-[#1C1E21]">Créer un compte</h1>
        <p className="text-[15px] text-[#606770]">C’est rapide et facile.</p>
      </div>
      <Separator className="my-3 bg-[#DADDE1]" />

      <form onSubmit={handleSubmit} className="space-y-3 px-4 pb-4">
        <div className="flex gap-3">
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Prénom"
            autoComplete="given-name"
            className={inputClass}
          />
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nom"
            autoComplete="family-name"
            className={inputClass}
          />
        </div>
        <Input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Numéro de téléphone ou adresse e-mail"
          autoComplete="username"
          className={inputClass}
        />
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nouveau mot de passe"
            autoComplete="new-password"
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#65676B]"
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        <ul className="space-y-0.5 px-1 text-xs">
          <li className={password.length >= 6 ? "text-[#42B72A]" : "text-[#606770]"}>
            {password.length >= 6 ? "✓" : "•"} Au moins 6 caractères
          </li>
          <li className={hasSymbol(password) ? "text-[#42B72A]" : "text-[#606770]"}>
            {hasSymbol(password) ? "✓" : "•"} Au moins un signe (par exemple ! @ # &)
          </li>
        </ul>
        <Input
          type={showPassword ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirmer le mot de passe"
          autoComplete="new-password"
          className={inputClass}
        />

        {error && <p className="text-sm text-[#E41E3F]">{error}</p>}

        <div className="pt-1 text-center">
          <Button
            type="submit"
            disabled={busy}
            className="h-11 w-full max-w-[220px] bg-[#42B72A] text-lg font-bold text-white hover:bg-[#36A420]"
          >
            {busy ? "Création..." : "S’inscrire"}
          </Button>
        </div>
        <p className="text-center">
          <Link href="/" className="text-[17px] text-[#0866FF] hover:underline">
            Vous avez déjà un compte ?
          </Link>
        </p>
      </form>
    </div>
  );
}
