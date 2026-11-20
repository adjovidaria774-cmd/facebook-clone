"use client";

import { useState } from "react";
import { MessageCircle, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { avatarColor } from "@/lib/avatar";
import { Button } from "@/components/ui/button";
import { MyAvatar } from "@/components/ProfileProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export type PostComment = { id: number; author: string; text: string };

export type Post = {
  id: number;
  author: string;
  mine?: boolean;
  time: string;
  text: string;
  image?: string;
  likes: number;
  liked: boolean;
  comments: PostComment[];
};

type Props = {
  post: Post;
  onLike: (id: number) => void;
  onComment: (id: number, text: string) => void;
  onDelete: (id: number) => void;
};

export default function PostCard({ post, onLike, onComment, onDelete }: Props) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  function sendComment() {
    const clean = commentText.trim();
    if (!clean) return;
    onComment(post.id, clean);
    setCommentText("");
  }

  const actionClass = "flex-1 gap-2 text-[15px] font-medium text-[#B0B3B8] hover:bg-[#3A3B3C] hover:text-[#E4E6EB]";

  return (
    <article className="rounded-xl bg-[#242526]">
      {/* En-tête */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          {post.mine ? (
            <MyAvatar className="size-10" />
          ) : (
            <Avatar className="size-10">
              <AvatarFallback style={{ backgroundColor: avatarColor(post.author) }} className="text-white">
                {post.author[0]}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <p className="text-[15px] font-semibold text-[#E4E6EB]">{post.author}</p>
            <p className="text-xs text-[#B0B3B8]">{post.time}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Supprimer la publication"
          onClick={() => setConfirmDelete(true)}
          className="text-[#B0B3B8] hover:bg-[#3A3B3C] hover:text-[#E4E6EB]"
        >
          <Trash2 className="size-5" />
        </Button>
      </div>

      {/* Contenu */}
      {post.text && <p className="px-3 pb-3 text-[15px] text-[#E4E6EB]">{post.text}</p>}
      {post.image && !imageFailed && (
        <div className="bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt="" onError={() => setImageFailed(true)} className="mx-auto max-h-[560px] w-auto max-w-full object-contain" />
        </div>
      )}

      {/* Compteurs */}
      <div className="flex justify-between px-3 py-2 text-sm text-[#B0B3B8]">
        <span>{post.likes > 0 ? `${post.likes} J’aime` : ""}</span>
        <button onClick={() => setShowComments((v) => !v)} className="hover:underline">
          {post.comments.length} commentaire{post.comments.length > 1 ? "s" : ""}
        </button>
      </div>

      <div className="px-3">
        <Separator className="bg-[#3E4042]" />
      </div>

      {/* Actions */}
      <div className="flex gap-1 p-1">
        <Button
          variant="ghost"
          onClick={() => onLike(post.id)}
          className={`${actionClass} ${post.liked ? "text-[#2D88FF] hover:text-[#2D88FF]" : ""}`}
        >
          <ThumbsUp className="size-5" /> J’aime
        </Button>
        <Button variant="ghost" onClick={() => setShowComments((v) => !v)} className={actionClass}>
          <MessageCircle className="size-5" /> Commenter
        </Button>
        <Button variant="ghost" className={actionClass}>
          <Share2 className="size-5" /> Partager
        </Button>
      </div>

      {/* Commentaires */}
      {showComments && (
        <div className="space-y-2 px-3 pb-3 pt-1">
          {post.comments.map((c) => (
            <div key={c.id} className="w-fit max-w-full rounded-2xl bg-[#3A3B3C] px-3 py-2">
              <p className="text-[13px] font-semibold text-[#E4E6EB]">{c.author}</p>
              <p className="text-[15px] text-[#E4E6EB]">{c.text}</p>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendComment()}
              placeholder="Écrire un commentaire..."
              className="h-9 rounded-full border-0 bg-[#3A3B3C] px-4 text-[#E4E6EB] placeholder:text-[#B0B3B8]"
            />
            <Button
              onClick={sendComment}
              disabled={!commentText.trim()}
              className="rounded-full bg-[#0866FF] text-white hover:bg-[#1A74FF] disabled:opacity-40"
            >
              Envoyer
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation avant suppression */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="border-[#3E4042] bg-[#242526] text-[#E4E6EB] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#E4E6EB]">Supprimer cette publication ?</DialogTitle>
            <DialogDescription className="text-[#B0B3B8]">
              Cette publication sera supprimée définitivement
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setConfirmDelete(false)}
              className="bg-[#3A3B3C] text-[#E4E6EB] hover:bg-[#4E4F50]"
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                setConfirmDelete(false);
                onDelete(post.id);
              }}
              className="bg-[#E41E3F] text-white hover:bg-[#C7193A]"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}
