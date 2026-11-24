import { Clapperboard, Music } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import FriendSuggestions from "@/components/FriendSuggestions";

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

      {/* Suggestions d'amis, puis contacts une fois ajoutés */}
      <FriendSuggestions layout="list" />
    </aside>
  );
}
