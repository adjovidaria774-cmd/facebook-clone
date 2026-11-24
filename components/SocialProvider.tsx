"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useProfile } from "@/components/ProfileProvider";
import type { Post } from "@/components/PostCard";
import { loadItem, saveItem } from "@/lib/db";
import { PEOPLE, type Person } from "@/lib/people";

export type FeedPost = Post & { personId?: string };

type SocialContextType = {
  posts: FeedPost[];
  friends: Person[];
  suggestions: Person[];
  loaded: boolean;
  addPost: (text: string, image?: string) => void;
  toggleLike: (id: number) => void;
  addComment: (id: number, text: string) => void;
  deletePost: (id: number) => void;
  addFriend: (personId: string) => void;
};

const SocialContext = createContext<SocialContextType | null>(null);

// Garde le fil d'actualité et la liste d'amis de la personne connectée (enregistrés dans IndexedDB)
export function SocialProvider({ children }: { children: ReactNode }) {
  const { user } = useProfile();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Au démarrage : on relit le fil et les amis de ce compte.
  // "loaded" ne passe à true que si la lecture a réussi, pour ne jamais écraser
  // les données enregistrées avec des listes vides.
  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    Promise.all([
      loadItem<FeedPost[]>(`feed:${user.id}`),
      loadItem<string[]>(`friends:${user.id}`),
    ])
      .then(([savedPosts, savedFriends]) => {
        if (cancelled) return;
        console.log("[Social] lu pour", user.id, "→ publications :", savedPosts?.length, "amis :", savedFriends);
        setPosts(savedPosts ?? []);
        setFriendIds(savedFriends ?? []);
        setLoaded(true);
      })
      .catch((e) => console.error("[Social] lecture impossible (rien n'est écrasé) :", e));
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  // À chaque changement, on enregistre
  useEffect(() => {
    if (!loaded) return;
    saveItem(`feed:${user.id}`, posts)
      .then(() => console.log("[Social] fil enregistré :", posts.length))
      .catch((e) => console.error("[Social] écriture du fil impossible :", e));
  }, [posts, loaded, user.id]);

  useEffect(() => {
    if (!loaded) return;
    saveItem(`friends:${user.id}`, friendIds)
      .then(() => console.log("[Social] amis enregistrés :", friendIds))
      .catch((e) => console.error("[Social] écriture des amis impossible :", e));
  }, [friendIds, loaded, user.id]);

  function addPost(text: string, image?: string) {
    const newPost: FeedPost = {
      id: Date.now(),
      author: `${user.firstName} ${user.lastName}`,
      mine: true,
      time: "À l’instant",
      text,
      image,
      likes: 0,
      liked: false,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
  }

  function toggleLike(id: number) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  }

  function addComment(id: number, text: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, comments: [...p.comments, { id: Date.now(), author: user.firstName, text }] }
          : p
      )
    );
  }

  function deletePost(id: number) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  // Ajouter un ami : ses publications arrivent dans le fil et sa story apparaît
  function addFriend(personId: string) {
    const person = PEOPLE.find((p) => p.id === personId);
    if (!person || friendIds.includes(personId)) return;
    setFriendIds((prev) => [...prev, personId]);
    setPosts((prev) => [...person.posts.map((p) => ({ ...p, personId })), ...prev]);
  }

  const friends = PEOPLE.filter((p) => friendIds.includes(p.id));
  const suggestions = PEOPLE.filter((p) => !friendIds.includes(p.id));

  return (
    <SocialContext.Provider
      value={{ posts, friends, suggestions, loaded, addPost, toggleLike, addComment, deletePost, addFriend }}
    >
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial(): SocialContextType {
  const ctx = useContext(SocialContext);
  if (!ctx) throw new Error("useSocial doit être utilisé dans SocialProvider");
  return ctx;
}