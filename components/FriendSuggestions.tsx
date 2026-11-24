"use client";

import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSocial } from "@/components/SocialProvider";
import { avatarColor } from "@/lib/avatar";
import type { Person } from "@/lib/people";

function PersonAvatar({ person, className }: { person: Person; className: string }) {
  return (
    <Avatar className={className}>
      <AvatarFallback style={{ backgroundColor: avatarColor(person.name) }} className="text-white">
        {person.name[0]}
      </AvatarFallback>
    </Avatar>
  );
}

// layout "cards" : cartes à faire défiler dans le fil (visible sur petit écran)
// layout "list"  : suggestions et contacts dans la colonne de droite (grand écran)
export default function FriendSuggestions({ layout }: { layout: "cards" | "list" }) {
  const { suggestions, friends, addFriend } = useSocial();

  if (layout === "cards") {
    if (suggestions.length === 0) return null;
    return (
      <section className="rounded-xl bg-[#242526] p-3">
        <h2 className="pb-2 text-[17px] font-semibold text-[#E4E6EB]">Personnes que vous pouvez connaître</h2>
        <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {suggestions.map((p) => (
            <div
              key={p.id}
              className="flex w-40 shrink-0 flex-col items-center gap-2 rounded-lg border border-[#3E4042] p-3 text-center"
            >
              <PersonAvatar person={p} className="size-16" />
              <div>
                <p className="text-[15px] font-medium text-[#E4E6EB]">{p.name}</p>
                <p className="text-xs text-[#B0B3B8]">{p.subtitle}</p>
              </div>
              <Button onClick={() => addFriend(p.id)} className="w-full gap-1 bg-[#0866FF] text-white hover:bg-[#1A74FF]">
                <UserPlus className="size-4" /> Ajouter
              </Button>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      {suggestions.length > 0 && (
        <>
          <h2 className="px-2 pb-2 text-[17px] font-semibold text-[#B0B3B8]">Suggestions d’amis</h2>
          <ul className="space-y-1">
            {suggestions.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-lg p-2">
                <PersonAvatar person={p} className="size-12 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium text-[#E4E6EB]">{p.name}</p>
                  <p className="truncate text-xs text-[#B0B3B8]">{p.subtitle}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => addFriend(p.id)}
                  className="bg-[#0866FF] text-white hover:bg-[#1A74FF]"
                >
                  Ajouter
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}

      {friends.length > 0 && (
        <>
          <h2 className="px-2 pb-2 pt-4 text-[17px] font-semibold text-[#B0B3B8]">Contacts</h2>
          <ul className="space-y-1">
            {friends.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-[#3A3B3C]">
                <PersonAvatar person={p} className="size-9 shrink-0" />
                <span className="truncate text-[15px] font-medium text-[#E4E6EB]">{p.name}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
