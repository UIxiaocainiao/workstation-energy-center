import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { useCountdown } from "@/hooks/useCountdown";
import { useLocale } from "@/hooks/useLocale";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { cn } from "@/lib/utils";

function getOffWorkTip(ms: number, isZh: boolean): string {
  if (ms <= 0) return isZh ? "今天辛苦了，记得下线休息" : "Good work today. Time to log off and rest.";
  return isZh ? "再撑一会儿，工位即将解除绑定" : "Hang in there. You're almost free from your desk.";
}

function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export function Countdown() {
  const { isZh } = useLocale();
  const { config, isLoading } = useSiteConfig();
  const { state, format } = useCountdown({
    offWorkTime: config.offWorkTime,
    payday: config.payday,
  }, isZh ? "zh" : "en");

  const offWorkTip = getOffWorkTip(state.offWorkMs, isZh);
  const weekend = isWeekend();

  const cards = useMemo(
    () => [
      {
        label: weekend
          ? isZh
            ? "今日可进入充电模式"
            : "Recharge mode available today"
          : isZh
            ? `距离 ${config.offWorkTime} 下班还有`
            : `Until off work at ${config.offWorkTime}`,
        value: weekend ? (isZh ? "🔋 充电中" : "🔋 Recharging") : format(state.offWorkMs),
        tip: weekend
          ? isZh
            ? "今天不用上班，给自己充个电"
            : "No work today. Take time to recharge."
          : offWorkTip,
        primary: true,
      },
      {
        label: isZh ? "距离周末还有" : "Until weekend",
        value: format(state.weekendMs),
        tip: isZh ? "你和自由只差一个倒计时" : "Freedom is one countdown away",
        primary: false,
      },
      {
        label: isZh ? `距离 ${config.payday} 号发工资还有` : `Until payday (${config.payday})`,
        value: format(state.paydayMs),
        tip: isZh ? "这笔精神损失费正在路上" : "Your compensation for emotional damage is on the way",
        primary: false,
      },
    ],
    [config.offWorkTime, config.payday, format, isZh, offWorkTip, state.offWorkMs, state.paydayMs, state.weekendMs, weekend],
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="section-title text-2xl font-medium">{isZh ? "下班倒计时" : "Off-Work Countdown"}</h2>
          <p className="mt-1 text-sm text-[var(--color-silver)]">
            {isZh ? "把今天撑过去，也算一种胜利。" : "Making it through today is a win."}
          </p>
        </div>
        {isLoading && <span className="text-xs text-white/45">{isZh ? "正在读取站点配置..." : "Loading site config..."}</span>}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((item) => (
          <Card key={item.label} className={cn(item.primary && "border-brand-500/30 bg-brand-500/10")}>
            <div className="text-sm text-[var(--color-silver)]">{item.label}</div>
            <div className={cn("mt-2 text-2xl font-semibold tabular-nums", item.primary && "text-brand-100")}>{item.value}</div>
            <div className="mt-2 text-sm text-white/45">{item.tip}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
