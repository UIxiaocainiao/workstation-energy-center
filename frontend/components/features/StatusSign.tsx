import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { useStatus } from "@/hooks/useStatus";
import { cn } from "@/lib/utils";

const STATUS_EMOJI_MAP: Record<string, string> = {
  still_holding: "😤",
  slightly_crashing: "😵",
  soul_out: "👻",
  online_but_off: "🔌",
  quit_but_mortgage: "🏠",
};

export function StatusSign() {
  const date = new Date().toISOString().slice(0, 10);
  const { options, selectedStatusKey, total, getCountByKey, isSubmitting, submitMutation } = useStatus(date);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const handleSubmit = (statusKey: string) => {
    const isUpdate = !!selectedStatusKey;
    setPendingKey(statusKey);

    submitMutation.mutate(statusKey, {
      onSuccess: () => {
        setPendingKey(null);
        if (isUpdate) {
          toast("已更新，情绪变化也很正常");
        } else {
          toast("今天也辛苦了");
        }
      },
      onError: () => {
        setPendingKey(null);
        toast.error("网络有点忙，点一次重试");
      },
    });
  };

  const displayedKey = pendingKey ?? selectedStatusKey;

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="section-title text-xl font-medium">今日状态签到</h2>
        <p className="mt-1 text-sm text-[var(--color-silver)]">今天的你，更接近哪一种状态？</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((item) => {
          const count = getCountByKey(item.key);
          const isSelected = displayedKey === item.key;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          const emoji = STATUS_EMOJI_MAP[item.key] ?? "✨";

          return (
            <button
              key={item.key}
              disabled={isSubmitting}
              className={cn(
                "rounded-2xl border px-4 py-4 text-left transition",
                isSelected
                  ? "border-brand-500/40 bg-brand-500/10"
                  : "border-[var(--color-frost-border)] bg-white/[0.02] hover:bg-white/[0.05]"
              )}
              onClick={() => handleSubmit(item.key)}
            >
              <div className="flex items-center gap-2">
                <span>{emoji}</span>
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.1]">
                  <div
                    className="h-full rounded-full bg-brand-500/40 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-white/60">{count}人</span>
              </div>
            </button>
          );
        })}
      </div>

      {options.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--color-frost-border)] bg-white/[0.02] px-4 py-6 text-sm text-[var(--color-silver)]">
          暂无可用状态选项，请先在后台配置。
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-[var(--color-silver)]">
        <span>
          {displayedKey ? "不是你一个人这样。" : "默认游客可用，不需要登录。"}
        </span>
        <span>今日共 {total} 人签到</span>
      </div>
    </Card>
  );
}
