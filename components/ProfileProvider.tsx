"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { loadItem, saveItem } from "@/lib/db";

type ProfileContextType = {
  photo: string;
  changePhoto: (file: File) => void;
};

const ProfileContext = createContext<ProfileContextType>({
  photo: "",
  changePhoto: () => {},
});

// Garde la photo de profil de Tony et la partage avec toute la page
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [photo, setPhoto] = useState("");

  // Au démarrage : on relit la photo enregistrée
  useEffect(() => {
    loadItem<string>("photo")
      .then((saved) => {
        if (saved) setPhoto(saved);
      })
      .catch(() => {});
  }, []);

  // Lit la photo choisie, la recadre en carré (256 px) et la garde en mémoire
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
          const original = reader.result as string;
          setPhoto(original);
          saveItem("photo", original).catch(() => {});
          return;
        }
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        const data = canvas.toDataURL("image/jpeg", 0.85);
        setPhoto(data);
        saveItem("photo", data).catch(() => {});
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  return <ProfileContext.Provider value={{ photo, changePhoto }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  return useContext(ProfileContext);
}

// Avatar de Tony. Avec editable, un clic dessus ouvre le choix d'une nouvelle photo.
export function MyAvatar({
  className = "size-10",
  editable = false,
  badge = false,
}: {
  className?: string;
  editable?: boolean;
  badge?: boolean;
}) {
  const { photo, changePhoto } = useProfile();
  const fileRef = useRef<HTMLInputElement>(null);

  const face = (
    <Avatar className={className}>
      {photo && <AvatarImage src={photo} alt="Ma photo de profil" />}
      <AvatarFallback>T</AvatarFallback>
    </Avatar>
  );

  if (!editable) return face;

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="Changer la photo de profil"
        title="Changer la photo de profil"
        onClick={() => fileRef.current?.click()}
        className="rounded-full"
      >
        {face}
      </button>
      {badge && (
        <span className="pointer-events-none absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#3A3B3C] text-[#E4E6EB]">
          <Camera className="size-2.5" />
        </span>
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
