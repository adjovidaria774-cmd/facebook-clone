import type { ReactNode } from "react";
import { ProfileProvider } from "@/components/ProfileProvider";
import { SocialProvider } from "@/components/SocialProvider";

export default function BienvenueLayout({ children }: { children: ReactNode }) {
  return (
    <ProfileProvider>
      <SocialProvider>{children}</SocialProvider>
    </ProfileProvider>
  );
}
