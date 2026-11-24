"use client";

import CreatePost from "@/components/CreatePost";
import Stories from "@/components/Stories";
import PostCard from "@/components/PostCard";
import FriendSuggestions from "@/components/FriendSuggestions";
import { useSocial } from "@/components/SocialProvider";

// Le fil d'actualité : un nouveau compte commence vide, sans ami
export default function Feed() {
  const { posts, loaded, addPost, toggleLike, addComment, deletePost } = useSocial();

  // Rien pendant la lecture de la base, pour éviter un clignotement
  if (!loaded) return null;

  return (
    <div className="space-y-4">
      <CreatePost onPublish={addPost} />
      <Stories />

      {/* Sur petit écran, les suggestions s'affichent ici (sur grand écran : colonne de droite) */}
      <div className="xl:hidden">
        <FriendSuggestions layout="cards" />
      </div>

      {posts.length === 0 && (
        <p className="rounded-xl bg-[#242526] p-6 text-center text-[#B0B3B8]">
          Ton fil est vide. Ajoute des personnes dans les suggestions pour voir leurs publications, ou écris
          quelque chose pour commencer.
        </p>
      )}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={toggleLike}
          onComment={addComment}
          onDelete={deletePost}
        />
      ))}
    </div>
  );
}
