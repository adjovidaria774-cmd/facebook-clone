import { Pencil } from "lucide-react";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Feed from "@/components/Feed";
import { Button } from "@/components/ui/button";

// Page d'accueil : accessible seulement quand on est connecté
export default function Home() {
  return (
    <div className="min-h-screen bg-[#18191A]">
      <Navbar />
      <div className="mx-auto flex max-w-[1600px] justify-between">
        <LeftSidebar />

        <main className="w-full min-w-0 max-w-[680px] px-2 py-4">
          <Feed />
        </main>

        <RightSidebar />
      </div>

      <Button
        size="icon"
        aria-label="Nouveau message"
        className="fixed bottom-4 right-4 size-12 rounded-full bg-[#3A3B3C] text-[#E4E6EB] shadow-lg hover:bg-[#4E4F50]"
      >
        <Pencil className="size-5" />
      </Button>
    </div>
  );
}