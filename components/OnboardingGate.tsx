"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/components/ProfileProvider";
import { loadItem } from "@/lib/db";

// Garde la page d'accueil : tant que la personne n'a pas terminé l'étape des
// suggestions d'amis (/bienvenue), elle ne peut pas voir l'accueil.
export default function OnboardingGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user } = useProfile();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadItem<boolean>(`onboarded:${user.id}`)
      .then((done) => {
        if (cancelled) return;
        if (done) setOk(true);
        else router.replace("/bienvenue");
      })
      .catch(() => {
        if (!cancelled) setOk(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user.id, router]);

  if (!ok) return <div className="min-h-screen bg-[#18191A]" />;
  return <>{children}</>;
}
