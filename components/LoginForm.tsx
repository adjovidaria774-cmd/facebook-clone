"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser, loginUser } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Si la personne est déjà connectée, on l'envoie directement à l'accueil
  useEffect(() => {
    getCurrentUser()
      .then((u) => {
        if (u) router.replace("/accueil");
      })
      .catch(() => {});
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!identifier.trim() || !password) {
      setError("Entre ton adresse e-mail ou ton numéro de téléphone, et ton mot de passe.");
      return;
    }
    setBusy(true);
    try {
      const result = await loginUser(identifier, password);
      if (!result.ok) {
        setError(result.error ?? "Connexion impossible.");
        setBusy(false);
        return;
      }
      router.push("/accueil");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Réessaie.");
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-[396px] rounded-lg bg-white p-4 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Adresse e-mail ou numéro de téléphone"
          autoComplete="username"
          className="h-12 bg-white px-4 text-base text-[#1C1E21]"
        />
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            autoComplete="current-password"
            className="h-12 bg-white px-4 pr-12 text-base text-[#1C1E21]"
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

        {error && <p className="text-sm text-[#E41E3F]">{error}</p>}

        <Button
          type="submit"
          disabled={busy}
          className="h-12 w-full bg-[#0866FF] text-lg font-bold text-white hover:bg-[#1A74FF]"
        >
          {busy ? "Connexion..." : "Se connecter"}
        </Button>

        <p className="text-center">
          <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-[#0866FF] hover:underline">
            Mot de passe oublié ?
          </a>
        </p>
      </form>

      <Separator className="my-5 bg-[#DADDE1]" />

      <div className="text-center">
        <Link
          href="/inscription"
          className="inline-flex h-12 items-center justify-center rounded-md bg-[#42B72A] px-6 text-[17px] font-bold text-white hover:bg-[#36A420]"
        >
          Créer un compte
        </Link>
      </div>
    </div>
  );
}
