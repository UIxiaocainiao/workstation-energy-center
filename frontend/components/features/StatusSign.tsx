import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useStatus } from "@/hooks/useStatus";

const OPTIONS = [
  { key: "still_holding", name: "还能忍" },
  { key: "slightly_crashing", name: "轻微崩溃" },
  { key: "soul_out", name: "灵魂出窍" },
  { key: "online_but_off", name: "表面在线，实际关机" },
  { key: "quit_but_mortgage", name: "想辞职但房贷不同意" }
];

export function StatusSign() {
  const date = new Date().toISOString().slice(0, 10);
  const { todayStatus, stats, submit } = useStatus(date);
  const selected = todayStatus.data?.record?.statusKey;

  return (
    <Card className="space-y-4" id="status-sign">
      <div>
        <h2 className="text-xl font-semibold">今日状态签到</h2>
        <p className="mt-1 text-sm text-slate-400">今天的你，更接近哪一种状态？</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {OPTIONS.map((item) => {
          const count = stats.data?.items.find((x) => x.statusKey === item.key)?.count ?? 0;
          return (
            <button
              key={item.key}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                selected === item.key
                  ? "border-brand-500 bg-brand-500/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
              onClick={() => submit.mutate(item.key)}
            >
              <div className="font-medium">{item.name}</div>
              <div className="mt-1 text-xs text-slate-400">今日已选 {count} 次</div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>{selected ? "今天也辛苦了，已经帮你记下。" : "默认游客可用，不需要登录。"}</span>
        {submit.isPending && <span>提交中...</span>}
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" disabled>{`总签到数：${stats.data?.total ?? 0}`}</Button>
      </div>
    </Card>
  );
}
