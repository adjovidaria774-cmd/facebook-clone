"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Camera, LogOut, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logoutUser, updateUserPhoto, type User } from "@/lib/auth";

type ProfileContextType = {
  user: User;
  photo: string;
  changePhoto: (file: File) => void;
  removePhoto: () => void;
  logout: () => void;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

// Entoure la page d'accueil : vérifie qu'une personne est connectée, sinon renvoie vers la connexion
export function ProfileProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then((u) => {
        if (u) setUser(u);
        else router.replace("/");
      })
      .catch(() => router.replace("/"));
  }, [router]);

  if (!user) return <div className="min-h-screen bg-[#18191A]" />;

  function applyPhoto(data: string) {
    if (!user) return;
    setUser({ ...user, photo: data });
    updateUserPhoto(user.id, data).catch(() => {});
  }

  // Lit la photo choisie, la recadre en carré (256 px), l'affiche et l'enregistre
  function changePhoto(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          applyPhoto(reader.result as string);
          return;
        }
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        applyPhoto(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Supprime la photo : on revient à la lettre du prénom
  function removePhoto() {
    applyPhoto("");
  }

  function logout() {
    logoutUser()
      .catch(() => {})
      .finally(() => router.push("/"));
  }

  return (
    <ProfileContext.Provider value={{ user, photo: user.photo ?? "", changePhoto, removePhoto, logout }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextType {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile doit être utilisé dans ProfileProvider");
  return ctx;
}

// Prénom (ou nom complet avec full) de la personne connectée
export function MyName({ full = false }: { full?: boolean }) {
  const { user } = useProfile();
  return <>{full ? `${user.firstName} ${user.lastName}` : user.firstName}</>;
}

// Avatar de la personne connectée. Avec editable, un clic ouvre un petit menu :
// choisir / changer la photo, ou la supprimer.
export function MyAvatar({
  className = "size-10",
  editable = false,
  badge = false,
}: {
  className?: string;
  editable?: boolean;
  badge?: boolean;
}) {
  const { user, photo, changePhoto, removePhoto } = useProfile();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const face = (
    <Avatar className={className}>
      {photo && <AvatarImage src={photo} alt="Ma photo de profil" />}
      <AvatarFallback>{user.firstName[0]?.toUpperCase()}</AvatarFallback>
    </Avatar>
  );

  if (!editable) return face;

  const itemClass =
    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[15px] text-[#E4E6EB] hover:bg-[#3A3B3C]";

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="Photo de profil"
        title="Photo de profil"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full"
      >
        {face}
      </button>
      {badge && (
        <span className="pointer-events-none absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#3A3B3C] text-[#E4E6EB]">
          <Camera className="size-2.5" />
        </span>
      )}

      {open && (
        <>
          {/* Zone invisible : un clic à côté ferme le menu */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={`absolute top-full z-50 mt-2 w-56 rounded-lg border border-[#3E4042] bg-[#242526] p-1 shadow-lg ${
              badge ? "left-0" : "right-0"
            }`}
          >
            <button
              type="button"
              className={itemClass}
              onClick={() => {
                setOpen(false);
                fileRef.current?.click();
              }}
            >
              <Camera className="size-4" />
              {photo ? "Changer la photo" : "Ajouter une photo"}
            </button>
            {photo && (
              <button
                type="button"
                className={`${itemClass} text-[#F3425F] hover:text-[#F3425F]`}
                onClick={() => {
                  setOpen(false);
                  removePhoto();
                }}
              >
                <Trash2 className="size-4" />
                Supprimer la photo
              </button>
            )}
          </div>
        </>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) changePhoto(file);
          e.target.value = "";
        }}
      />
    </span>
  );
}

// Bouton de déconnexion
export function LogoutButton() {
  const { logout } = useProfile();
  return (
    <Button
      variant="secondary"
      size="icon"
      aria-label="Se déconnecter"
      title="Se déconnecter"
      onClick={logout}
      className="size-10 rounded-full bg-[#3A3B3C] text-[#E4E6EB] hover:bg-[#4E4F50]"
    >
      <LogOut className="size-5" />
    </Button>
  );
}
