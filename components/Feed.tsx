"use client";

import { useEffect, useState } from "react";
import CreatePost from "@/components/CreatePost";
import Stories from "@/components/Stories";
import PostCard, { type Post } from "@/components/PostCard";
import { loadItem, saveItem } from "@/lib/db";

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "Amina Kossou",
    time: "Il y a 2 h",
    text: "Quelle ambiance hier soir au concert à Cotonou ! La musique, la danse, tout le monde chantait. Soirée inoubliable.",
    image: "/photos/concert.jpg",
    likes: 24,
    liked: false,
    comments: [
      { id: 1, author: "Koffi Mensah", text: "J’étais là aussi, c’était magnifique !" },
      { id: 2, author: "Sènami Dossou", text: "Vous auriez dû m’inviter" },
    ],
  },
  {
    id: 2,
    author: "Koffi Mensah",
    time: "Il y a 4 h",
    text: "Quel match ce soir ! Tout le quartier devant l’écran, on a crié jusqu’à la dernière minute.",
    image: "/photos/football.jpg",
    likes: 18,
    liked: false,
    comments: [{ id: 1, author: "Yves Agbodjan", text: "Le meilleur match de la saison !" }],
  },
  {
    id: 3,
    author: "Sènami Dossou",
    time: "Hier",
    text: "Dimanche détente à la plage avec les amis : maïs grillé, poisson braisé et bonne musique.",
    image: "/photos/plage.jpg",
    likes: 31,
    liked: false,
    comments: [],
  },
  {
    id: 4,
    author: "Yves Agbodjan",
    time: "Hier",
    text: "Quelle série regardez-vous en ce moment ? Je cherche quelque chose de bien pour ce soir.",
    likes: 9,
    liked: false,
    comments: [{ id: 1, author: "Grâce Tchibozo", text: "Regarde un bon film nigérian, ça change !" }],
  },
];

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [loaded, setLoaded] = useState(false);

  // Au démarrage : on relit les publications enregistrées (sinon on garde celles de départ)
  useEffect(() => {
    loadItem<Post[]>("posts")
      .then((saved) => {
        if (saved) setPosts(saved);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // À chaque changement (publier, liker, commenter, supprimer) : on enregistre
  useEffect(() => {
    if (!loaded) return;
    saveItem("posts", posts).catch(() => {});
  }, [posts, loaded]);

  function addPost(text: string, image?: string) {
    const newPost: Post = {
      id: Date.now(),
      author: "Tony",
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
          ? { ...p, comments: [...p.comments, { id: Date.now(), author: "Tony", text }] }
          : p
      )
    );
  }

  function deletePost(id: number) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  // Écran vide très court pendant la lecture de la base, pour ne pas voir les posts de départ clignoter
  if (!loaded) return null;

  return (
    <div className="space-y-4">
      <CreatePost onPublish={addPost} />
      <Stories />
      {posts.length === 0 && (
        <p className="rounded-xl bg-[#242526] p-6 text-center text-[#B0B3B8]">
          Aucune publication. Écris quelque chose pour commencer.
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
