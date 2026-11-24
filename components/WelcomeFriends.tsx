"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/components/ProfileProvider";
import { useSocial } from "@/components/SocialProvider";
import { saveItem } from "@/lib/db";
import { avatarColor } from "@/lib/avatar";
import { PEOPLE } from "@/lib/people";

// Nombre de suggestions à traiter (ajouter ou ignorer) avant d'accéder à l'accueil
const REQUIRED = 5;

// Page affichée après l'inscription : la personne accepte ou ignore au moins 5 suggestions d'amis
export default function WelcomeFriends() {
  const router = useRouter();
  const { user } = useProfile();
  const { friends, loaded, addFriend } = useSocial();
  const [ignored, setIgnored] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!loaded) return <div className="min-h-screen bg-[#F0F2F5]" />;

  const visible = PEOPLE.filter((p) => !ignored.includes(p.id));
  const addedCount = friends.length;
  const required = Math.min(REQUIRED, PEOPLE.length);
  const decided = Math.min(addedCount + ignored.length, required);
  const canContinue = addedCount + ignored.length >= required;

  async function goHome() {
    if (!canContinue) return;
    setBusy(true);
    setError("");
    try {
      await saveItem(`onboarded:${user.id}`, true);
    } catch {
      setError("Impossible d'enregistrer. Réessaie.");
      setBusy(false);
      return;
    }
    router.push("/accueil");
  }

  return (
    <main className="min-h-screen bg-[#F0F2F5] px-4 py-8">
      <div className="mx-auto w-full max-w-[560px]">
        <h1 className="text-center text-4xl font-bold tracking-tight text-[#0866FF]">facebook</h1>

        <div className="mt-6 rounded-lg bg-white p-4 shadow">
          <h2 className="text-[22px] font-bold text-[#1C1E21]">
            Bienvenue, {user.firstName} ! Trouve des amis
          </h2>
          <p className="mt-1 text-[15px] text-[#606770]">
            Ajoute des personnes pour voir leurs stories et leurs publications dans ton fil d’actualité. Tu peux
            ignorer celles que tu ne veux pas.
          </p>

          {/* Progression */}
          <div className="mt-4">
            <div className="flex justify-between text-sm font-medium text-[#1C1E21]">
              <span>
                {decided} / {required} suggestions traitées
              </span>
              {canContinue && <span className="text-[#42B72A]">C’est bon !</span>}
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#E4E6EB]">
              <div
                className="h-full rounded-full bg-[#0866FF] transition-all"
                style={{ width: `${required === 0 ? 100 : (decided / required) * 100}%` }}
              />
            </div>
          </div>

          <ul className="mt-4 space-y-3">
            {visible.map((p) => {
              const added = friends.some((f) => f.id === p.id);
              return (
                <li key={p.id} className="flex items-center gap-3 rounded-lg border border-[#DADDE1] p-3">
                  <Avatar className="size-14 shrink-0">
                    <AvatarFallback style={{ backgroundColor: avatarColor(p.name) }} className="text-white">
                      {p.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[16px] font-semibold text-[#1C1E21]">{p.name}</p>
                    <p className="truncate text-sm text-[#606770]">{p.subtitle}</p>
                    <div className="mt-2 flex gap-2">
                      {added ? (
                        <Button disabled className="h-9 flex-1 gap-1 bg-[#E4E6EB] text-[#1C1E21] opacity-100">
                          <Check className="size-4" /> Ami ajouté
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={() => addFriend(p.id)}
                            className="h-9 flex-1 gap-1 bg-[#0866FF] text-white hover:bg-[#1A74FF]"
                          >
                            <UserPlus className="size-4" /> Ajouter
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setIgnored((prev) => [...prev, p.id])}
                            className="h-9 flex-1 bg-[#E4E6EB] text-[#1C1E21] hover:bg-[#D8DADF]"
                          >
                            Ignorer
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {visible.length === 0 && (
            <p className="mt-4 text-center text-[15px] text-[#606770]">Plus de suggestions pour le moment.</p>
          )}

          {error && <p className="mt-3 text-center text-sm text-[#E41E3F]">{error}</p>}

          <div className="mt-5 text-center">
            <Button
              onClick={goHome}
              disabled={busy || !canContinue}
              className="h-11 w-full bg-[#0866FF] text-lg font-bold text-white hover:bg-[#1A74FF] disabled:opacity-40"
            >
              {busy
                ? "Chargement..."
                : addedCount > 0
                  ? `Continuer (${addedCount} ami${addedCount > 1 ? "s" : ""})`
                  : "Continuer"}
            </Button>
            {!canContinue && (
              <p className="mt-2 text-xs text-[#606770]">
                Ajoute ou ignore encore {required - decided} personne{required - decided > 1 ? "s" : ""} pour
                continuer.
              </p>
            )}
            {canContinue && addedCount === 0 && (
              <p className="mt-2 text-xs text-[#606770]">
                Sans ami ajouté, ton fil d’actualité sera vide au début.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
