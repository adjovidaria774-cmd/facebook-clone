import { ProfileProvider } from "@/components/ProfileProvider";
import { SocialProvider } from "@/components/SocialProvider";
import WelcomeFriends from "@/components/WelcomeFriends";

// Page affichée juste après l'inscription : choix des premiers amis
export default function WelcomePage() {
  return (
    <ProfileProvider>
      <SocialProvider>
        <WelcomeFriends />
      </SocialProvider>
    </ProfileProvider>
  );
}
