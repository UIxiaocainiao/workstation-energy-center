import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useComfort } from "@/hooks/useComfort";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ComfortBox() {
  const { daily, random } = useComfort();
  const [drawnText, setDrawnText] = useState<string | null>(null);
  // E-05: Track recent results to avoid repeats
  const recentResults = useRef<string[]>([]);

  const displayText = drawnText ?? daily.data?.content ?? "正在加载今日安慰一句...";
  const hasResult = !!(drawnText || daily.data?.content);

  const handleDraw = useCallback(() => {
    random.mutate(undefined, {
      onSuccess: (data) => {
        // E-05: Check for recent duplicates, retry once if duplicate
        if (recentResults.current.includes(data.content) && recentResults.current.length < 10) {
          // Silently retry once
          random.mutate(undefined, {
            onSuccess: (retryData) => {
              setDrawnText(retryData.content);
              recentResults.current = [retryData.content, ...recentResults.current].slice(0, 3);
            },
          });
          return;
        }
        setDrawnText(data.content);
        recentResults.current = [data.content, ...recentResults.current].slice(0, 3);
      },
      onError: () => {
        // E-06: Error toast
        toast.error("网络有点忙，点一次再试试");
      },
    });
  }, [random]);

  const handleCopy = useCallback(async () => {
    if (!displayText || displayText === "正在加载今日安慰一句...") return;
    await navigator.clipboard.writeText(displayText);
    toast("已复制到剪贴板");
  }, [displayText]);

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="section-title text-xl font-medium">补能盲盒</h2>
        <p className="mt-1 text-sm text-[var(--color-silver)]">
          {drawnText ? "这一句送给此刻的你" : "默认给你一句轻安慰，撑不住时再抽一条。"}
        </p>
      </div>

      {/* E-01/E-03: Comfort text display */}
      <div className="rounded-2xl border border-[var(--color-frost-border)] bg-white/[0.02] p-5">
        <p className="text-lg leading-relaxed text-[var(--color-near-white)]">{displayText}</p>
      </div>

      {/* E-02/E-04: Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleDraw} disabled={random.isPending}>
          {random.isPending ? "抽取中..." : drawnText ? "再抽一次" : "抽一句补能"}
        </Button>
        {hasResult && (
          <Button variant="secondary" onClick={handleCopy}>
            复制这句
          </Button>
        )}
      </div>
    </Card>
  );
}
