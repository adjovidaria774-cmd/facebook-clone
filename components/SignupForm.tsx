"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/Logo";
import { isEmail, isPhone, registerUser } from "@/lib/auth";
import { loadItem, saveItem } from "@/lib/db";

const fieldClass =
  "h-14 w-full rounded-2xl border border-[#CED0D4] bg-white px-4 text-[15px] text-[#1C1E21] placeholder:text-[#65676B] outline-none focus:border-[#0866FF] focus:ring-1 focus:ring-[#0866FF]";
const selectClass = `${fieldClass} appearance-none pr-10`;

const MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

// Année fixe : Next.js (Cache Components) refuse new Date() pendant le rendu
const THIS_YEAR = 2026;

// Vrai s'il y a au moins un signe : ni lettre (accentuée ou non), ni chiffre, ni espace
const hasSymbol = (value: string) => /[^A-Za-z0-9À-ÿ\s]/.test(value);

type Draft = {
  firstName: string;
  lastName: string;
  day: string;
  month: string;
  year: string;
  gender: string;
  identifier: string;
};

function Select({
  value,
  onChange,
  placeholder,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${selectClass} ${value ? "" : "text-[#65676B]"}`}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2" />
    </div>
  );
}

export default function SignupForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Au chargement : on remet ce qui avait été saisi (jamais le mot de passe)
  useEffect(() => {
    loadItem<Draft | null>("signup-draft")
      .then((d) => {
        if (!d) return;
        setFirstName(d.firstName ?? "");
        setLastName(d.lastName ?? "");
        setDay(d.day ?? "");
        setMonth(d.month ?? "");
        setYear(d.year ?? "");
        setGender(d.gender ?? "");
        setIdentifier(d.identifier ?? "");
      })
      .catch((e) => console.error("Brouillon illisible :", e))
      .finally(() => setDraftLoaded(true));
  }, []);

  // À chaque changement : on enregistre le brouillon
  useEffect(() => {
    if (!draftLoaded) return;
    const draft: Draft = { firstName, lastName, day, month, year, gender, identifier };
    saveItem("signup-draft", draft).catch((e) =>
      console.error("Brouillon non enregistré :", e)
    );
  }, [draftLoaded, firstName, lastName, day, month, year, gender, identifier]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim() || !identifier.trim() || !password) {
      setError("Remplis tous les champs.");
      return;
    }
    if (!day || !month || !year) {
      setError("Choisis ta date de naissance.");
      return;
    }
    if (!gender) {
      setError("Sélectionne ton genre.");
      return;
    }
    const value = identifier.trim();
    if (value.includes("@") ? !isEmail(value) : !isPhone(value)) {
      setError(
        value.includes("@")
          ? "Entre une adresse e-mail valide."
          : "Entre un numéro de mobile valide (8 chiffres minimum) ou une adresse e-mail."
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

    setBusy(true);
    try {
      const result = await registerUser({ firstName, lastName, identifier, password });
      if (!result.ok) {
        setError(result.error ?? "Inscription impossible.");
        setBusy(false);
        return;
      }
      await saveItem("signup-draft", null).catch(() => {}); // le brouillon n'est plus utile
      router.push("/bienvenue"); // la personne est connectée directement
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Réessaie.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-white px-5 py-8 text-[#1C1E21]">
      <div className="mx-auto w-full max-w-[536px]">
        <a href="/" aria-label="Retour" className="inline-block">
          <ChevronLeft className="size-6" />
        </a>

        <div className="mt-3">
          <Logo size={44} />
        </div>

        <h1 className="mt-5 text-[22px] font-semibold leading-7">
          Démarrez sur Facebook à l’aide d’un compte Meta
        </h1>
        <p className="mt-2 text-sm">
          Un Compte Meta vous permet d’accéder facilement et en toute sécurité à plusieurs
          technologies Meta, comme Facebook.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="mb-2 block text-[15px] font-semibold">Nom</label>
          <div className="flex gap-3">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Prénom"
              autoComplete="given-name"
              className={fieldClass}
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nom"
              autoComplete="family-name"
              className={fieldClass}
            />
          </div>

          <label className="mb-2 mt-6 block text-[15px] font-semibold">Date de naissance</label>
          <div className="flex gap-3">
            <Select value={day} onChange={setDay} placeholder="Jour">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
            <Select value={month} onChange={setMonth} placeholder="Mois">
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </Select>
            <Select value={year} onChange={setYear} placeholder="Année">
              {Array.from({ length: 111 }, (_, i) => THIS_YEAR - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Select>
          </div>

          <label className="mb-2 mt-6 block text-[15px] font-semibold">Genre</label>
          <Select value={gender} onChange={setGender} placeholder="Sélectionnez votre genre">
            <option value="femme">Femme</option>
            <option value="homme">Homme</option>
            <option value="autre">Autre</option>
          </Select>

          <label className="mb-2 mt-6 block text-[15px] font-semibold">
            Numéro de mobile ou adresse e-mail
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Numéro de mobile ou adresse e-mail"
            autoComplete="username"
            className={fieldClass}
          />
          <p className="mt-3 text-sm">
            Vous pouvez être amené(e) à recevoir des notifications de notre part.{" "}
            <span className="font-semibold text-[#0866FF]">
              Découvrez pourquoi nous vous demandons vos coordonnées
            </span>
          </p>

          <label className="mb-2 mt-6 block text-[15px] font-semibold">Mot de passe</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoComplete="new-password"
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
          <ul className="mt-2 space-y-0.5 px-1 text-xs">
            <li className={password.length >= 6 ? "text-[#42B72A]" : "text-[#65676B]"}>
              {password.length >= 6 ? "✓" : "•"} Au moins 6 caractères
            </li>
            <li className={hasSymbol(password) ? "text-[#42B72A]" : "text-[#65676B]"}>
              {hasSymbol(password) ? "✓" : "•"} Au moins un signe (par exemple ! @ # &)
            </li>
          </ul>

          <p className="mt-8 text-sm">
            Il se pourrait que des personnes utilisant notre service aient importé vos
            coordonnées sur Facebook.{" "}
            <span className="font-semibold text-[#0866FF]">En savoir plus.</span>
          </p>
          <p className="mt-4 text-sm">
            En appuyant sur Envoyer, vous consentez à la création d’un compte et acceptez les{" "}
            <span className="font-semibold text-[#0866FF]">Conditions générales</span>, la{" "}
            <span className="font-semibold text-[#0866FF]">Politique de confidentialité</span> et
            la <span className="font-semibold text-[#0866FF]">Politique d’utilisation des cookies</span>{" "}
            de Facebook.
          </p>

          {error && <p className="mt-4 text-sm text-[#E41E3F]">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-6 h-12 w-full cursor-pointer rounded-full bg-[#0866FF] text-[15px] font-semibold text-white hover:bg-[#1A74FF] disabled:opacity-70"
          >
            {busy ? "Création..." : "Envoyer"}
          </button>

          <a
            href="/"
            className="mt-3 flex h-12 w-full items-center justify-center rounded-full border border-[#CED0D4] text-[15px] font-semibold hover:bg-[#F2F3F5]"
          >
            J’ai déjà un compte
          </a>
        </form>
      </div>
    </div>
  );
}