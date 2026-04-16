import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";

/** T-04: Get time-aware tip text */
function getOffWorkTip(ms: number): string {
  if (ms <= 0) return "今天辛苦了，记得下线休息";
  return "再撑一会儿，工位即将解除绑定";
}

function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export function Countdown() {
  const { state, format } = useCountdown({
    offWorkTime: "18:00",
    payday: 15,
  });

  const offWorkTip = getOffWorkTip(state.offWorkMs);
  const weekend = isWeekend();

  const cards = useMemo(
    () => [
      {
        label: weekend ? "今日可进入充电模式" : "距离下班还有",
        value: weekend ? "🔋 充电中" : format(state.offWorkMs),
        tip: weekend ? "今天不用上班，给自己充个电" : offWorkTip,
        primary: true,
      },
      {
        label: "距离周末还有",
        value: format(state.weekendMs),
        tip: "你和自由只差一个倒计时",
        primary: false,
      },
      {
        label: "距离发工资还有",
        value: format(state.paydayMs),
        tip: "这笔精神损失费正在路上",
        primary: false,
      },
    ],
    [state, format, offWorkTip, weekend]
  );

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((item) => (
        <Card
          key={item.label}
          className={cn(
            item.primary && "border-brand-500/30 bg-brand-500/10"
          )}
        >
          <div className="text-sm text-[var(--color-silver)]">{item.label}</div>
          <div
            className={cn(
              "mt-2 text-2xl font-semibold tabular-nums",
              item.primary && "text-brand-100"
            )}
          >
            {item.value}
          </div>
          <div className="mt-2 text-sm text-white/45">{item.tip}</div>
        </Card>
      ))}
    </section>
  );
}
