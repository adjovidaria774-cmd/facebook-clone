import { Bell, Gamepad2, Grid3x3, Home, MessageCircle, Search, Store, Tv, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Même ordre que sur Facebook : accueil, vidéos, marketplace, groupes, jeux
const NAV_ICONS = [
  { icon: Home, label: "Accueil", active: true },
  { icon: Tv, label: "Vidéos", active: false },
  { icon: Store, label: "Marketplace", active: false },
  { icon: Users, label: "Groupes", active: false },
  { icon: Gamepad2, label: "Jeux", active: false },
];

const ACTIONS = [
  { icon: Grid3x3, label: "Menu", badge: 0 },
  { icon: MessageCircle, label: "Messenger", badge: 0 },
  { icon: Bell, label: "Notifications", badge: 17 },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#3E4042] bg-[#242526] px-3 md:grid md:grid-cols-[1fr_auto_1fr]">
      {/* Gauche : logo + recherche */}
      <div className="flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#0866FF] text-2xl font-bold text-white">
          f
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#B0B3B8]" />
          <Input
            type="text"
            placeholder="Rechercher sur Facebook"
            className="h-10 w-10 rounded-full border-0 bg-[#3A3B3C] pl-9 text-[#E4E6EB] placeholder:text-transparent md:w-64 md:placeholder:text-[#B0B3B8]"
          />
        </div>
      </div>

      {/* Centre : navigation (cachée sur téléphone) */}
      <nav className="hidden h-full items-center gap-1 md:flex">
        {NAV_ICONS.map(({ icon: Icon, label, active }) => (
          <Button
            key={label}
            variant="ghost"
            aria-label={label}
            className={`relative h-12 w-14 rounded-lg hover:bg-[#3A3B3C] lg:w-28 ${
              active ? "text-[#2D88FF] hover:text-[#2D88FF]" : "text-[#B0B3B8]"
            }`}
          >
            <Icon className="size-6" />
            {active && <span className="absolute -bottom-1 h-[3px] w-full rounded-t bg-[#2D88FF]" />}
          </Button>
        ))}
      </nav>

      {/* Droite : actions + profil */}
      <div className="flex items-center gap-2 md:justify-self-end">
        {ACTIONS.map(({ icon: Icon, label, badge }) => (
          <Button
            key={label}
            variant="secondary"
            size="icon"
            aria-label={label}
            className="relative size-10 rounded-full bg-[#3A3B3C] text-[#E4E6EB] hover:bg-[#4E4F50]"
          >
            <Icon className="size-5" />
            {badge > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-[#E41E3F] px-1.5 text-xs font-medium leading-5 text-white">
                {badge}
              </span>
            )}
          </Button>
        ))}
        <Avatar className="size-10">
          <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Mon profil" />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
