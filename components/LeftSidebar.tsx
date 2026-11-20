import { Bookmark, ChevronDown, Clock, LayoutDashboard, Sparkles, Users, Users2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ITEMS = [
  { icon: Sparkles, label: "Meta AI", color: "text-[#A855F7]" },
  { icon: Users, label: "Ami(e)s", color: "text-[#2D88FF]" },
  { icon: LayoutDashboard, label: "Tableau de bord Creator", color: "text-[#2D88FF]" },
  { icon: Clock, label: "Souvenirs", color: "text-[#2D88FF]" },
  { icon: Bookmark, label: "Enregistrements", color: "text-[#A855F7]" },
  { icon: Users2, label: "Groupes", color: "text-[#2D88FF]" },
];

const SHORTCUTS = [
  { name: "Agence Web Cotonou", img: 5 },
  { name: "Tony Front-end", img: 12 },
  { name: "Club Code Bénin", img: 33 },
  { name: "Studio Atlantique", img: 41 },
];

const itemClass =
  "h-12 w-full justify-start gap-3 rounded-lg p-2 text-[15px] font-medium text-[#E4E6EB] hover:bg-[#3A3B3C] hover:text-[#E4E6EB]";

export default function LeftSidebar() {
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-80 shrink-0 flex-col overflow-y-auto p-2 pr-4 lg:flex">
      <ul className="space-y-1">
        <li>
          <Button variant="ghost" className={itemClass}>
            <Avatar className="size-9">
              <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="" />
              <AvatarFallback>T</AvatarFallback>
            </Avatar>
            Tony
          </Button>
        </li>
        {ITEMS.map(({ icon: Icon, label, color }) => (
          <li key={label}>
            <Button variant="ghost" className={itemClass}>
              <Icon className={`size-9 p-1.5 ${color}`} />
              {label}
            </Button>
          </li>
        ))}
        <li>
          <Button variant="ghost" className={itemClass}>
            <ChevronDown className="size-9 rounded-full bg-[#3A3B3C] p-2" />
            Voir plus
          </Button>
        </li>
      </ul>

      <Separator className="my-3 bg-[#3E4042]" />

      <h2 className="px-2 pb-1 text-[17px] font-semibold text-[#B0B3B8]">Vos raccourcis</h2>
      <ul className="space-y-1">
        {SHORTCUTS.map((s) => (
          <li key={s.name}>
            <Button variant="ghost" className={itemClass}>
              <Avatar className="size-9">
                <AvatarImage src={`https://i.pravatar.cc/80?img=${s.img}`} alt="" />
                <AvatarFallback>{s.name[0]}</AvatarFallback>
              </Avatar>
              {s.name}
            </Button>
          </li>
        ))}
      </ul>

      <p className="mt-auto px-2 pt-6 text-xs leading-5 text-[#B0B3B8]">
        Confidentialité · Conditions générales · Publicités · Choix publicitaires · Cookies · Plus
      </p>
    </aside>
  );
}
