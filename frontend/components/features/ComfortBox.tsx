import { useComfort } from "@/hooks/useComfort";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ComfortBox() {
  const { daily, random } = useComfort();

  async function handleCopy() {
    const text = random.data?.content || daily.data?.content;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    alert("已复制");
  }

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">补能盲盒</h2>
        <p className="mt-1 text-sm text-slate-400">默认给你一句轻安慰，撑不住时再抽一条。</p>
      </div>

      <div className="rounded-2xl bg-white/5 p-4 text-slate-100">
        {random.data?.content || daily.data?.content || "正在加载今日安慰一句..."}
      </div>

      <div className="flex gap-2">
        <Button onClick={() => random.mutate()}>{random.isPending ? "抽取中..." : "一键抽补能盲盒"}</Button>
        <Button variant="secondary" onClick={handleCopy}>复制文案</Button>
      </div>
    </Card>
  );
}
