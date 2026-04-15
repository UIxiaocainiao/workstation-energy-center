import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Input";
import { useTranslator, type TranslatorMode } from "@/hooks/useTranslator";

const modeOptions: Array<{ key: TranslatorMode; label: string; placeholder: string }> = [
  {
    key: "boss_to_truth",
    label: "老板黑话 → 真实含义",
    placeholder: "例如：这个需求不复杂"
  },
  {
    key: "truth_to_polite",
    label: "真实吐槽 → 体面表达",
    placeholder: "例如：这活不是我的"
  }
];

export function Translator({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<TranslatorMode>("boss_to_truth");
  const [inputText, setInputText] = useState("");
  const { examples, generate } = useTranslator(mode);

  const currentMode = useMemo(() => modeOptions.find((item) => item.key === mode)!, [mode]);
  const result = generate.data;

  async function handleCopy() {
    if (!result?.resultText) return;
    await navigator.clipboard.writeText(result.resultText);
    alert("已复制");
  }

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{compact ? "首页简版黑话翻译器" : "职场黑话翻译器"}</h2>
        <p className="mt-1 text-sm text-slate-400">老板说得很委婉，但你听得很明白。</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {modeOptions.map((item) => (
          <Button
            key={item.key}
            variant={mode === item.key ? "primary" : "secondary"}
            onClick={() => setMode(item.key)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <Textarea
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
        placeholder={currentMode.placeholder}
        maxLength={100}
      />

      <div className="flex flex-wrap gap-2">
        {examples.data?.examples.map((example) => (
          <Button key={example} variant="ghost" onClick={() => setInputText(example)}>
            {example}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => generate.mutate(inputText)}
          disabled={inputText.trim().length < 2 || generate.isPending}
        >
          {generate.isPending ? "生成中..." : "生成结果"}
        </Button>
        {!compact && (
          <Button
            variant="secondary"
            onClick={() => generate.mutate(inputText)}
            disabled={inputText.trim().length < 2 || generate.isPending}
          >
            再来一句
          </Button>
        )}
      </div>

      {result && (
        <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4">
          <div className="text-xs text-brand-100">{result.resultType}</div>
          <div className="mt-2 whitespace-pre-wrap text-lg">{result.resultText}</div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleCopy}>复制结果</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
