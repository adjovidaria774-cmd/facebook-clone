import { Clapperboard, Music } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { avatarColor } from "@/lib/avatar";

const ADS = [
  {
    title: "Grand concert ce samedi à Cotonou",
    site: "exemple-concert.com",
    icon: Music,
    from: "#7C3AED",
    to: "#DB2777",
  },
  {
    title: "Nouveaux films à l’affiche ce week-end",
    site: "exemple-cinema.com",
    icon: Clapperboard,
    from: "#1D4ED8",
    to: "#0EA5E9",
  },
];

export default function RightSidebar() {
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-80 shrink-0 overflow-y-auto p-2 pl-4 xl:block">
      <h2 className="px-2 pb-2 pt-2 text-[17px] font-semibold text-[#B0B3B8]">Sponsorisé</h2>
      <ul className="space-y-1">
        {ADS.map((ad) => {
          const Icon = ad.icon;
          return (
            <li key={ad.title}>
              <a href="#" className="flex gap-3 rounded-lg p-2 hover:bg-[#3A3B3C]">
                <div
                  className="flex h-24 w-36 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${ad.from}, ${ad.to})` }}
                >
                  <Icon className="size-10 text-white/90" />
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-medium leading-5 text-[#E4E6EB]">{ad.title}</p>
                  <p className="mt-1 text-xs text-[#B0B3B8]">{ad.site}</p>
                </div>
              </a>
            </li>
          );
        })}
      </ul>

      <Separator className="my-3 bg-[#3E4042]" />

      <div className="flex items-center justify-between px-2 pb-2">
        <h2 className="text-[17px] font-semibold text-[#B0B3B8]">Invitations</h2>
        <a href="#" className="text-sm text-[#2D88FF] hover:underline">
          Voir tout
        </a>
      </div>
      <div className="flex gap-3 p-2">
        <Avatar className="size-14 shrink-0">
          <AvatarFallback style={{ backgroundColor: avatarColor("Fatou Diallo") }} className="text-white">
            F
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-medium text-[#E4E6EB]">Fatou Diallo</p>
            <span className="flex items-center gap-1 text-xs text-[#2D88FF]">
              1 sem. <span className="size-2 rounded-full bg-[#2D88FF]" />
            </span>
          </div>
          <p className="text-xs text-[#B0B3B8]">1 ami(e) en commun</p>
          <div className="mt-2 flex gap-2">
            <Button className="flex-1 bg-[#0866FF] text-white hover:bg-[#1A74FF]">Confirmer</Button>
            <Button variant="secondary" className="flex-1 bg-[#3A3B3C] text-[#E4E6EB] hover:bg-[#4E4F50]">
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
