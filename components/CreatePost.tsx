"use client";

import { useRef, useState } from "react";
import { Clapperboard, ImagePlus, Video, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  onPublish: (text: string, image?: string) => void;
};

export default function CreatePost({ onPublish }: Props) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);

  // Lecture de la photo choisie : on la transforme en texte (data URL) pour l'afficher et la garder
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = ""; // permet de rechoisir la même photo plus tard
  }

  function publish() {
    const clean = text.trim();
    if (!clean && !image) return;
    onPublish(clean, image);
    setText("");
    setImage(undefined);
  }

  const canPublish = text.trim() !== "" || image !== undefined;

  return (
    <div className="rounded-xl bg-[#242526] p-3">
      <div className="flex items-center gap-2">
        <Avatar className="size-10">
          <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="" />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && publish()}
          placeholder="Quoi de neuf, Tony ?"
          className="h-10 rounded-full border-0 bg-[#3A3B3C] px-4 text-[#E4E6EB] placeholder:text-[#B0B3B8]"
        />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Vidéo en direct"
          className="hidden size-10 rounded-full text-[#F3425F] hover:bg-[#3A3B3C] hover:text-[#F3425F] sm:inline-flex"
        >
          <Video className="size-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Ajouter une photo"
          onClick={() => fileRef.current?.click()}
          className="size-10 rounded-full text-[#45BD62] hover:bg-[#3A3B3C] hover:text-[#45BD62]"
        >
          <ImagePlus className="size-6" />
        </Button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Reel"
          className="hidden size-10 rounded-full text-[#F7599B] hover:bg-[#3A3B3C] hover:text-[#F7599B] sm:inline-flex"
        >
          <Clapperboard className="size-6" />
        </Button>
        <Button
          onClick={publish}
          disabled={!canPublish}
          className="rounded-full bg-[#0866FF] px-4 text-white hover:bg-[#1A74FF] disabled:opacity-40"
        >
          Publier
        </Button>
      </div>

      {/* Aperçu de la photo choisie */}
      {image && (
        <div className="relative mt-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Aperçu de la photo" className="max-h-72 w-full rounded-lg object-cover" />
          <Button
            variant="secondary"
            size="icon"
            aria-label="Retirer la photo"
            onClick={() => setImage(undefined)}
            className="absolute right-2 top-2 size-8 rounded-full bg-[#18191A]/80 text-[#E4E6EB] hover:bg-[#18191A]"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
