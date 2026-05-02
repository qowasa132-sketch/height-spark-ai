import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Heart, MessageCircle, Trash2, Flag, Send, LogOut, Users } from "lucide-react";
import { toast } from "sonner";
import { BottomTabs } from "@/components/BottomTabs";
import { AuthDialog } from "@/components/community/AuthDialog";
import { supabase } from "@/integrations/supabase/client";
import { useSession, signOut, isAdmin } from "@/lib/auth";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "المجتمع — HeightBoost AI" },
      { name: "description", content: "شارك تقدمك وتفاعل مع المجتمع." },
    ],
  }),
  component: CommunityPage,
});

interface Profile {
  user_id: string;
  display_name: string;
}
interface CommentRow {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
}
interface PostRow {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
  like_count: number;
  liked_by_me: boolean;
  comments: CommentRow[];
  comments_loaded: boolean;
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "الآن";
  if (diff < 3600) return `${Math.floor(diff / 60)} د`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} س`;
  return `${Math.floor(diff / 86400)} ي`;
}

function CommunityPage() {
  const { user, loading: authLoading } = useSession();
  const [admin, setAdmin] = useState(false);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [composer, setComposer] = useState("");
  const [posting, setPosting] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [draftComments, setDraftComments] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) void isAdmin(user.id).then(setAdmin);
    else setAdmin(false);
  }, [user]);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    const { data: postsData, error } = await supabase
      .from("posts")
      .select("id, user_id, content, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      toast.error("تعذّر تحميل المنشورات");
      setLoading(false);
      return;
    }
    const ids = (postsData ?? []).map((p) => p.id);
    const userIds = Array.from(new Set((postsData ?? []).map((p) => p.user_id)));

    const [{ data: likesData }, { data: profilesData }] = await Promise.all([
      ids.length
        ? supabase.from("likes").select("post_id, user_id").in("post_id", ids)
        : Promise.resolve({ data: [] as { post_id: string; user_id: string }[] }),
      userIds.length
        ? supabase.from("profiles").select("user_id, display_name").in("user_id", userIds)
        : Promise.resolve({ data: [] as Profile[] }),
    ]);

    const profileMap = new Map<string, Profile>(
      (profilesData ?? []).map((p) => [p.user_id, p as Profile]),
    );
    const likeCounts = new Map<string, number>();
    const myLikes = new Set<string>();
    for (const l of likesData ?? []) {
      likeCounts.set(l.post_id, (likeCounts.get(l.post_id) ?? 0) + 1);
      if (user && l.user_id === user.id) myLikes.add(l.post_id);
    }

    setPosts(
      (postsData ?? []).map((p) => ({
        ...p,
        profile: profileMap.get(p.user_id),
        like_count: likeCounts.get(p.id) ?? 0,
        liked_by_me: myLikes.has(p.id),
        comments: [],
        comments_loaded: false,
      })),
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void loadFeed();
  }, [loadFeed]);

  // Realtime: refresh on new posts/likes/comments
  useEffect(() => {
    const ch = supabase
      .channel("community")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => void loadFeed())
      .on("postgres_changes", { event: "*", schema: "public", table: "likes" }, () => void loadFeed())
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [loadFeed]);

  const requireAuth = (): boolean => {
    if (!user) {
      setShowAuth(true);
      return false;
    }
    return true;
  };

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth() || !user) return;
    const content = composer.trim();
    if (!content) return;
    if (content.length > 2000) {
      toast.error("النص طويل جداً (٢٠٠٠ حرف كحد أقصى)");
      return;
    }
    setPosting(true);
    const { error } = await supabase.from("posts").insert({ user_id: user.id, content });
    setPosting(false);
    if (error) {
      toast.error("تعذّر النشر");
      return;
    }
    setComposer("");
    void loadFeed();
  };

  const toggleLike = async (post: PostRow) => {
    if (!requireAuth() || !user) return;
    // Optimistic
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, liked_by_me: !p.liked_by_me, like_count: p.like_count + (p.liked_by_me ? -1 : 1) }
          : p,
      ),
    );
    if (post.liked_by_me) {
      await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", user.id);
    } else {
      await supabase.from("likes").insert({ post_id: post.id, user_id: user.id });
    }
  };

  const loadComments = async (postId: string) => {
    const { data } = await supabase
      .from("comments")
      .select("id, post_id, user_id, content, created_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    const userIds = Array.from(new Set((data ?? []).map((c) => c.user_id)));
    const { data: profs } = userIds.length
      ? await supabase.from("profiles").select("user_id, display_name").in("user_id", userIds)
      : { data: [] as Profile[] };
    const profMap = new Map<string, Profile>((profs ?? []).map((p) => [p.user_id, p as Profile]));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: (data ?? []).map((c) => ({ ...c, profile: profMap.get(c.user_id) })),
              comments_loaded: true,
            }
          : p,
      ),
    );
  };

  const toggleComments = (postId: string) => {
    const next = !openComments[postId];
    setOpenComments({ ...openComments, [postId]: next });
    const post = posts.find((p) => p.id === postId);
    if (next && post && !post.comments_loaded) void loadComments(postId);
  };

  const submitComment = async (postId: string) => {
    if (!requireAuth() || !user) return;
    const content = (draftComments[postId] ?? "").trim();
    if (!content) return;
    if (content.length > 1000) {
      toast.error("التعليق طويل جداً");
      return;
    }
    const { error } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: user.id, content });
    if (error) {
      toast.error("تعذّر التعليق");
      return;
    }
    setDraftComments({ ...draftComments, [postId]: "" });
    void loadComments(postId);
  };

  const deletePost = async (postId: string) => {
    if (!confirm("هل أنت متأكد من حذف المنشور؟")) return;
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) toast.error("فشل الحذف");
    else {
      toast.success("تم الحذف");
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  const deleteComment = async (postId: string, commentId: string) => {
    if (!confirm("حذف التعليق؟")) return;
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    if (error) toast.error("فشل الحذف");
    else {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) } : p,
        ),
      );
    }
  };

  const reportComment = async (commentId: string) => {
    if (!requireAuth() || !user) return;
    const reason = prompt("سبب الإبلاغ (اختياري):") ?? "";
    const { error } = await supabase
      .from("reports")
      .insert({ comment_id: commentId, reporter_id: user.id, reason });
    if (error) {
      if (error.code === "23505") toast.message("تم الإبلاغ مسبقاً عن هذا التعليق");
      else toast.error("فشل الإبلاغ");
    } else {
      toast.success("تم استلام البلاغ");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background pb-24 text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="text-base font-bold">المجتمع</h1>
          </div>
          {user ? (
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-[11px] text-muted-foreground"
              aria-label="تسجيل الخروج"
            >
              <LogOut className="h-3 w-3" /> خروج
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowAuth(true)}
              className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground"
            >
              دخول
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pt-4 space-y-4">
        {/* Composer */}
        <form
          onSubmit={submitPost}
          className="rounded-2xl border border-border bg-card p-3 shadow-glow"
        >
          <textarea
            value={composer}
            onClick={() => !user && setShowAuth(true)}
            onChange={(e) => setComposer(e.target.value)}
            placeholder={user ? "شارك تجربتك أو سؤالك..." : "سجّل دخولك للمشاركة"}
            maxLength={2000}
            rows={3}
            className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            disabled={!user}
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">{composer.length}/2000</span>
            <button
              type="submit"
              disabled={posting || !composer.trim() || !user}
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-glow disabled:opacity-50"
            >
              <Send className="h-3 w-3" />
              نشر
            </button>
          </div>
        </form>

        {/* Feed */}
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">جارٍ التحميل...</div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            لا توجد منشورات بعد — كن أول من يشارك!
          </div>
        ) : (
          posts.map((post) => {
            const canDeletePost = user && (user.id === post.user_id || admin);
            return (
              <article
                key={post.id}
                className="rounded-2xl border border-border bg-card p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      {post.profile?.display_name ?? "مستخدم"}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{timeAgo(post.created_at)}</div>
                  </div>
                  {canDeletePost && (
                    <button
                      type="button"
                      onClick={() => void deletePost(post.id)}
                      className="rounded-full p-1.5 text-muted-foreground hover:text-destructive"
                      aria-label="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {post.content}
                </p>

                <div className="flex items-center gap-4 border-t border-border/50 pt-2">
                  <button
                    type="button"
                    onClick={() => void toggleLike(post)}
                    className={`flex items-center gap-1.5 text-xs transition ${
                      post.liked_by_me ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${post.liked_by_me ? "fill-primary" : ""}`}
                      style={post.liked_by_me ? { filter: "drop-shadow(0 0 6px var(--primary))" } : undefined}
                    />
                    {post.like_count}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  >
                    <MessageCircle className="h-4 w-4" />
                    تعليق
                  </button>
                </div>

                {openComments[post.id] && (
                  <div className="space-y-2 border-t border-border/50 pt-3">
                    {!post.comments_loaded ? (
                      <div className="text-center text-[11px] text-muted-foreground">...</div>
                    ) : post.comments.length === 0 ? (
                      <div className="text-center text-[11px] text-muted-foreground">
                        لا تعليقات بعد
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {post.comments.map((c) => {
                          const canDelComment = user && (user.id === c.user_id || admin);
                          return (
                            <li
                              key={c.id}
                              className="rounded-xl bg-background/40 p-2.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-[11px] font-bold text-foreground">
                                    {c.profile?.display_name ?? "مستخدم"}
                                  </span>
                                  <span className="text-[9px] text-muted-foreground">
                                    {timeAgo(c.created_at)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => void reportComment(c.id)}
                                    className="rounded-full p-1 text-muted-foreground/70 hover:text-destructive"
                                    aria-label="إبلاغ"
                                    title="إبلاغ"
                                  >
                                    <Flag className="h-3 w-3" />
                                  </button>
                                  {canDelComment && (
                                    <button
                                      type="button"
                                      onClick={() => void deleteComment(post.id, c.id)}
                                      className="rounded-full p-1 text-muted-foreground/70 hover:text-destructive"
                                      aria-label="حذف"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="mt-1 whitespace-pre-wrap text-[12px] leading-relaxed text-muted-foreground">
                                {c.content}
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={draftComments[post.id] ?? ""}
                        onClick={() => !user && setShowAuth(true)}
                        onChange={(e) =>
                          setDraftComments({ ...draftComments, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            void submitComment(post.id);
                          }
                        }}
                        maxLength={1000}
                        placeholder={user ? "اكتب تعليقاً..." : "سجّل دخولك للتعليق"}
                        className="flex-1 rounded-full border border-border bg-background/40 px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
                        disabled={!user}
                      />
                      <button
                        type="button"
                        onClick={() => void submitComment(post.id)}
                        disabled={!(draftComments[post.id] ?? "").trim() || !user}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
                        aria-label="إرسال"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </main>

      <BottomTabs active="community" />
      {showAuth && !authLoading && <AuthDialog onClose={() => setShowAuth(false)} />}
    </div>
  );
}
