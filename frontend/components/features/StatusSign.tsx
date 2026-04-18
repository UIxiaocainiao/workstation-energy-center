import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { useLocale } from "@/hooks/useLocale";
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
  const { isZh } = useLocale();
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
          toast(isZh ? "已更新，情绪变化也很正常" : "Updated. Mood changes are normal.");
        } else {
          toast(isZh ? "今天也辛苦了" : "You made it through today.");
        }
      },
      onError: () => {
        setPendingKey(null);
        toast.error(isZh ? "网络有点忙，点一次重试" : "Network is busy, please try again");
      },
    });
  };

  const displayedKey = pendingKey ?? selectedStatusKey;

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="section-title text-xl font-medium">{isZh ? "今日状态签到" : "Daily Mood Check-in"}</h2>
        <p className="mt-1 text-sm text-[var(--color-silver)]">
          {isZh ? "今天的你，更接近哪一种状态？" : "Which state feels closest to you today?"}
        </p>
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
                  : "border-[var(--color-frost-border)] bg-white/[0.02] hover:bg-white/[0.05]",
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
                <span className="text-xs text-white/60">{isZh ? `${count}人` : `${count} people`}</span>
              </div>
            </button>
          );
        })}
      </div>

      {options.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--color-frost-border)] bg-white/[0.02] px-4 py-6 text-sm text-[var(--color-silver)]">
          {isZh
            ? "暂无可用状态选项，请先在后台配置。"
            : "No mood options available yet. Please configure them in admin."}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-[var(--color-silver)]">
        <span>{displayedKey ? (isZh ? "不是你一个人这样。" : "You are not alone.") : isZh ? "默认游客可用，不需要登录。" : "Guest mode is enabled by default. No login required."}</span>
        <span>{isZh ? `今日共 ${total} 人签到` : `${total} check-ins today`}</span>
      </div>
    </Card>
  );
}
