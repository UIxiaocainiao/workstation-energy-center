import { Card } from "@/components/ui/Card";
import { useCountdown } from "@/hooks/useCountdown";

export function Countdown() {
  const { state, format } = useCountdown({
    offWorkTime: "18:00",
    payday: 15
  });

  const cards = [
    { label: "距离下班还有", value: format(state.offWorkMs), tip: "再撑一会儿，工位即将解除绑定" },
    { label: "距离周末还有", value: format(state.weekendMs), tip: "你和自由只差一个倒计时" },
    { label: "距离发工资还有", value: format(state.paydayMs), tip: "这笔精神损失费正在路上" }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((item) => (
        <Card key={item.label}>
          <div className="text-sm text-slate-400">{item.label}</div>
          <div className="mt-2 text-2xl font-semibold">{item.value}</div>
          <div className="mt-2 text-sm text-slate-500">{item.tip}</div>
        </Card>
      ))}
    </section>
  );
}
