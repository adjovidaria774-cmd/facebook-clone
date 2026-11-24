"use client";

import { useRef } from "react";
import { Camera, ChevronRight, Clapperboard, Gamepad2, Music, Plus, Trophy, Utensils } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { avatarColor } from "@/lib/avatar";
import { useProfile } from "@/components/ProfileProvider";
import { useSocial } from "@/components/SocialProvider";
import type { Person } from "@/lib/people";

const ICONS: Record<Person["icon"], typeof Music> = {
  music: Music,
  trophy: Trophy,
  utensils: Utensils,
  clapperboard: Clapperboard,
  camera: Camera,
  gamepad: Gamepad2,
};

// Nom court : « Amina Kossou » devient « Amina K. »
function shortName(name: string) {
  const [first, ...rest] = name.split(" ");
  return rest.length ? `${first} ${rest[0][0]}.` : first;
}

export default function Stories() {
  const listRef = useRef<HTMLDivElement>(null);
  const { user, photo } = useProfile();
  const { friends } = useSocial(); // seules les stories des amis ajoutés apparaissent

  return (
    <div className="relative">
      <div
        ref={listRef}
        className="flex gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Carte « Créer une story » */}
        <button className="relative h-[152px] w-[105px] shrink-0 overflow-hidden rounded-lg bg-[#242526]">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="h-[96px] w-full object-cover" />
          ) : (
            <div className="flex h-[96px] w-full items-center justify-center bg-[#3A3B3C] text-3xl font-semibold text-[#E4E6EB]">
              {user.firstName[0].toUpperCase()}
            </div>
          )}
          <span className="absolute left-1/2 top-[80px] flex size-8 -translate-x-1/2 items-center justify-center rounded-full border-4 border-[#242526] bg-[#0866FF] text-white">
            <Plus className="size-4" />
          </span>
          <span className="absolute inset-x-2 bottom-2 text-center text-xs font-medium leading-4 text-[#E4E6EB]">
            Créer une story
          </span>
        </button>

        {friends.map((p) => {
          const Icon = ICONS[p.icon];
          const name = shortName(p.name);
          return (
            <button
              key={p.id}
              className="relative h-[152px] w-[105px] shrink-0 overflow-hidden rounded-lg"
              style={{ background: `linear-gradient(160deg, ${p.from}, ${p.to})` }}
            >
              <Icon className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-white/80" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
              <Avatar className="absolute left-2 top-2 size-8 ring-[3px] ring-[#0866FF]">
                <AvatarFallback style={{ backgroundColor: avatarColor(p.name) }} className="text-white">
                  {p.name[0]}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-2 left-2 text-xs font-medium text-white">{name}</span>
            </button>
          );
        })}
      </div>

      {/* Flèche pour faire défiler : seulement s'il y a assez de stories */}
      {friends.length > 3 && (
        <button
          aria-label="Stories suivantes"
          onClick={() => listRef.current?.scrollBy({ left: 220 })}
          className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#3A3B3C] text-[#E4E6EB] shadow hover:bg-[#4E4F50]"
        >
          <ChevronRight className="size-5" />
        </button>
      )}
    </div>
  );
}
