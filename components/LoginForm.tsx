"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/Logo";
import { getCurrentUser, loginUser } from "@/lib/auth";

const fieldClass =
  "h-14 w-full rounded-xl border border-[#CED0D4] bg-white px-4 text-[15px] text-[#1C1E21] placeholder:text-[#65676B] outline-none focus:border-[#0866FF] focus:ring-1 focus:ring-[#0866FF]";

function Hero() {
  return (
    <div className="relative mx-auto hidden h-[420px] w-[420px] lg:block">
      {/* Petite photo à gauche (coussins) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-2.jpg"
        alt=""
        className="absolute left-0 top-24 h-44 w-44 rounded-3xl object-cover shadow-md"
      />

      {/* Grande photo verticale (skatepark) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-1.jpg"
        alt=""
        className="absolute left-36 top-0 h-80 w-60 rounded-3xl object-cover object-[50%_35%] shadow-lg"
      />

      {/* Carte du bas (pop-corn) */}
      <div className="absolute left-28 top-60 h-44 w-48 rounded-2xl bg-white p-3 shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-3.jpg" alt="" className="h-24 w-full rounded-lg object-cover" />
        <div className="mt-3 h-2.5 w-full rounded bg-[#E4E6EB]" />
        <div className="mt-2 h-2.5 w-2/3 rounded bg-[#E4E6EB]" />
      </div>

      <div className="absolute left-2 top-2 flex size-16 items-center justify-center rounded-full bg-[#FFD54A] text-4xl shadow">
        😄
      </div>
      <div className="absolute left-60 top-6 rounded-xl bg-[#6C63E0] px-3 py-1 text-sm font-semibold text-white shadow">
        16:45
      </div>
      <div className="absolute left-[330px] top-64 flex size-16 items-center justify-center rounded-full bg-[#F02849] text-3xl text-white shadow-lg">
        ♥
      </div>

      {/* Portrait rond */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-4.jpg"
        alt=""
        className="absolute left-72 top-80 size-24 rounded-full border-4 border-[#0866FF] object-cover object-[50%_30%] shadow-lg"
      />
    </div>
  );
}

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
    <div className="flex min-h-screen flex-col bg-white text-[#1C1E21]">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Gauche : logo, illustration, slogan */}
        <div className="flex flex-col justify-between px-6 py-8 lg:w-1/2 lg:border-r lg:border-[#DADDE1] lg:px-10">
          <Logo size={64} />
          <div className="my-6 lg:my-0">
            <Hero />
          </div>
          <h1 className="hidden text-[56px] font-bold leading-[1.05] tracking-tight lg:block">
            Explorez
            <br />
            les sujets
            <br />
            que <span className="text-[#0866FF]">vous</span>
            <br />
            <span className="text-[#0866FF]">aimez</span>.
          </h1>
        </div>

        {/* Droite : formulaire */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 lg:w-1/2">
          <div className="w-full max-w-[520px]">
            <div className="mb-8 flex items-center gap-4">
              <ChevronLeft className="size-5" />
              <h2 className="text-base font-semibold">Se connecter à Facebook</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="E-mail ou numéro de mobile"
                autoComplete="username"
                className={fieldClass}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  autoComplete="current-password"
                  className={`${fieldClass} pr-12`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#65676B]"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>

              {error && <p className="text-sm text-[#E41E3F]">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="h-12 w-full rounded-full bg-[#0866FF] text-[15px] font-semibold text-white hover:bg-[#1A74FF] disabled:opacity-70"
              >
                {busy ? "Connexion..." : "Se connecter"}
              </button>

              <p className="pt-3 text-center">
                <a href="#" onClick={(e) => e.preventDefault()} className="text-[15px] hover:underline">
                  Mot de passe oublié ?
                </a>
              </p>
            </form>

            <div className="mt-20">
              <button type="button" onClick={() => window.location.assign("/inscription")}
                className="flex h-12 w-full items-center justify-center rounded-full border border-[#0866FF] text-[15px] font-semibold text-[#0866FF] hover:bg-[#F0F6FF]"
              >
                Créer un nouveau compte
              </button>
              <p className="mt-6 text-center text-[15px] font-semibold text-[#1C1E21]">∞ Meta</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <footer className="border-t border-[#DADDE1] px-6 py-6 text-xs text-[#65676B] lg:px-[18%]">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <span>Français (France)</span>
          <span>English (US)</span>
          <span>العربية</span>
          <span>Español</span>
          <span>Deutsch</span>
          <span>Italiano</span>
          <span>Autres langues...</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          <span>S’inscrire</span>
          <span>Se connecter</span>
          <span>Messenger</span>
          <span>Facebook Lite</span>
          <span>Vidéo</span>
          <span>Meta Pay</span>
          <span>Meta AI</span>
          <span>Instagram</span>
          <span>Threads</span>
        </div>
      </footer>
    </div>
  );
}