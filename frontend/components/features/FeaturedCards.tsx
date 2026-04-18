import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import { getDeviceId } from "@/lib/device";
import { useLocale } from "@/hooks/useLocale";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type FeaturedCardItem = {
  id: string;
  type: string;
  title: string;
  content: string;
  tag: string;
  likeRealCount: number;
  likeSayCount: number;
  likeSameCount: number;
};

type Response = {
  items: FeaturedCardItem[];
};

/** C-05: Track reacted cards in localStorage for 24h dedup */
function getReactionStorageKey(cardId: string, reactionType: string) {
  return `reaction_${cardId}_${reactionType}`;
}

function hasReactedRecently(cardId: string, reactionType: string): boolean {
  if (typeof window === "undefined") return false;
  const key = getReactionStorageKey(cardId, reactionType);
  const ts = localStorage.getItem(key);
  if (!ts) return false;
  return Date.now() - Number(ts) < 24 * 60 * 60 * 1000;
}

function markReacted(cardId: string, reactionType: string) {
  const key = getReactionStorageKey(cardId, reactionType);
  localStorage.setItem(key, String(Date.now()));
}

export function FeaturedCards() {
  const { isZh } = useLocale();
  const queryClient = useQueryClient();
  const deviceId = typeof window !== "undefined" ? getDeviceId() : "server";

  const reactions = useMemo(
    () => [
      { type: "real", label: isZh ? "太真实了" : "Too Real", countKey: "likeRealCount" as const },
      { type: "say", label: isZh ? "替我说了" : "Said It For Me", countKey: "likeSayCount" as const },
      { type: "same", label: isZh ? "我也一样" : "Same Here", countKey: "likeSameCount" as const },
    ],
    [isZh],
  );

  const cards = useQuery({
    queryKey: ["featured-cards"],
    queryFn: () => apiClient.get<Response>("/cards/featured", { page: 1, pageSize: 6 }),
  });

  const reactMutation = useMutation({
    mutationFn: ({ cardId, reactionType }: { cardId: string; reactionType: string }) =>
      apiClient.post("/cards/reaction", { cardId, reactionType, deviceId }),
    // C-03: Optimistic update
    onMutate: async ({ cardId, reactionType }) => {
      await queryClient.cancelQueries({ queryKey: ["featured-cards"] });
      const previous = queryClient.getQueryData<Response>(["featured-cards"]);

      queryClient.setQueryData<Response>(["featured-cards"], (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) => {
            if (item.id !== cardId) return item;
            const countKey = reactions.find((r) => r.type === reactionType)?.countKey;
            if (!countKey) return item;
            return { ...item, [countKey]: item[countKey] + 1 };
          }),
        };
      });

      return { previous };
    },
    onSuccess: (_data, { cardId, reactionType }) => {
      markReacted(cardId, reactionType);
      // C-04: Toast feedback
      toast(isZh ? "你不是一个人" : "You are not alone");
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(["featured-cards"], context.previous);
      }
      toast.error(isZh ? "网络有点忙，点一次重试" : "Network is busy, please try again");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["featured-cards"] });
    },
  });

  const handleReaction = useCallback(
    (cardId: string, reactionType: string) => {
      // C-05: 24h dedup
      if (hasReactedRecently(cardId, reactionType)) {
        toast(isZh ? "你已经点过了，明天再来" : "Already reacted. Come back tomorrow.");
        return;
      }
      reactMutation.mutate({ cardId, reactionType });
    },
    [isZh, reactMutation],
  );

  const items = cards.data?.items;

  // C-06: Empty state
  if (cards.isSuccess && (!items || items.length === 0)) {
    return (
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="section-title text-2xl font-medium">{isZh ? "精选共鸣内容" : "Featured Resonance"}</h2>
          <p className="mt-1 text-sm text-[var(--color-silver)]">
            {isZh ? "高压工作日里，你并不是一个人。" : "You are not alone in high-pressure workdays."}
          </p>
        </div>
        <Card className="py-12 text-center">
          <p className="text-[var(--color-silver)]">
            {isZh ? "今天的共鸣内容正在路上，先去领个今日状态" : "Today's resonance content is on the way. Check in your mood first."}
          </p>
          <Link href="/status" className="mt-3 inline-block text-sm text-brand-500 hover:text-brand-100">
            {isZh ? "去状态签到" : "Go to Mood Check-in"} →
          </Link>
        </Card>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="section-title text-2xl font-medium">{isZh ? "精选共鸣内容" : "Featured Resonance"}</h2>
        <p className="mt-1 text-sm text-[var(--color-silver)]">
          {isZh ? "高压工作日里，你并不是一个人。" : "You are not alone in high-pressure workdays."}
        </p>
      </div>

      {/* C-01: Featured cards grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items?.map((item) => (
          <Card key={item.id} className="flex h-full flex-col justify-between">
            <div>
              <span className="inline-block rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs text-brand-100">
                {item.tag}
              </span>
              <div className="mt-2 text-lg font-semibold">{item.title}</div>
              <p className="mt-3 text-sm leading-6 text-white/75">{item.content}</p>
            </div>

            {/* C-02: Reaction buttons */}
            <div className="mt-5 flex flex-wrap gap-2">
              {reactions.map((reaction) => {
                const count = item[reaction.countKey];
                const reacted = hasReactedRecently(item.id, reaction.type);
                return (
                  <button
                    key={reaction.type}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                      reacted
                        ? "border-brand-500/40 bg-brand-500/15 text-brand-100"
                        : "border-[var(--color-frost-border)] bg-white/[0.02] text-white/70 hover:bg-white/[0.06]",
                    )}
                    onClick={() => handleReaction(item.id, reaction.type)}
                  >
                    {reaction.label} {count}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
