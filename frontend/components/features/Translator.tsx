import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Input";
import { useTranslator, type TranslatorMode } from "@/hooks/useTranslator";
import { cn } from "@/lib/utils";

const modeOptions: Array<{ key: TranslatorMode; label: string; placeholder: string }> = [
  {
    key: "boss_to_truth",
    label: "老板黑话 → 真实含义",
    placeholder: "例如：这个需求不复杂",
  },
  {
    key: "truth_to_polite",
    label: "真实吐槽 → 体面表达",
    placeholder: "例如：这活不是我的",
  },
];

export function Translator({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<TranslatorMode>("boss_to_truth");
  const [inputText, setInputText] = useState("");
  const [validationMsg, setValidationMsg] = useState("");
  const { examples, generate } = useTranslator(mode);

  const currentMode = useMemo(() => modeOptions.find((item) => item.key === mode)!, [mode]);
  const result = generate.data;
  const trimmed = inputText.trim();

  // TR-09/TR-10: Input validation
  function validate(): boolean {
    if (trimmed.length < 2) {
      setValidationMsg("再多说一点，我才能更懂你");
      return false;
    }
    if (trimmed.length > 100) {
      setValidationMsg("最多输入 100 字，先抓重点");
      return false;
    }
    setValidationMsg("");
    return true;
  }

  function handleGenerate() {
    if (!validate()) return;
    generate.mutate(inputText, {
      onError: () => {
        // TR-11/TR-12: Preserve input, show error toast
        toast.error("网络有点忙，点一次重试");
      },
    });
  }

  async function handleCopy() {
    if (!result?.resultText) return;
    await navigator.clipboard.writeText(result.resultText);
    toast("已复制到剪贴板");
  }

  // TR-03/TR-04/TR-05: Dynamic button text
  function getButtonText(): string {
    if (generate.isPending) return "翻译中...";
    if (trimmed.length === 0) return "先选一句示例";
    return "立即翻译";
  }

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="section-title text-xl font-medium">
          {compact ? "首页简版黑话翻译器" : "职场黑话翻译器"}
        </h2>
        <p className="mt-1 text-sm text-[var(--color-silver)]">老板说得很委婉，但你听得很明白。</p>
      </div>

      {/* TR-01/TR-08: Mode toggle - doesn't clear input */}
      <div className="flex flex-wrap gap-2">
        {modeOptions.map((item) => (
          <button
            key={item.key}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              mode === item.key
                ? "border-brand-500/40 bg-brand-500/10 text-brand-100"
                : "border-[var(--color-frost-border)] bg-white/[0.02] text-white/70 hover:bg-white/[0.06]"
            )}
            onClick={() => {
              setMode(item.key);
              setValidationMsg("");
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* TR-02: Example tags fill input */}
      <div className="flex flex-wrap gap-2">
        {examples.data?.examples.map((example) => (
          <button
            key={example}
            className="rounded-full border border-[var(--color-frost-border)] bg-white/[0.02] px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/[0.06]"
            onClick={() => {
              setInputText(example);
              setValidationMsg("");
            }}
          >
            {example}
          </button>
        ))}
      </div>

      <div>
        <Textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (validationMsg) setValidationMsg("");
          }}
          placeholder={currentMode.placeholder}
          maxLength={100}
        />
        {/* TR-09/TR-10: Validation message */}
        {validationMsg && (
          <p className="mt-1.5 text-xs text-brand-500">{validationMsg}</p>
        )}
        <div className="mt-1 text-right text-xs text-white/45">
          {trimmed.length}/100
        </div>
      </div>

      {/* TR-05/TR-06: Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={handleGenerate}
          disabled={trimmed.length === 0 || generate.isPending}
        >
          {getButtonText()}
        </Button>
        {result && (
          <Button variant="secondary" onClick={handleGenerate} disabled={generate.isPending}>
            再来一句
          </Button>
        )}
        {/* TR-07: Compact mode shows link to full translator */}
        {compact && (
          <Link
            href="/blackwords"
            className="ml-auto text-xs text-white/60 transition hover:text-white/85"
          >
            打开完整翻译器 →
          </Link>
        )}
      </div>

      {/* TR-06: Result card */}
      {result && (
        <div className="rounded-2xl border border-brand-500/35 bg-brand-500/10 p-4">
          <div className="text-xs text-brand-100">{result.resultType}</div>
          <div className="mt-2 whitespace-pre-wrap text-lg">{result.resultText}</div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={handleCopy}>
              复制结果
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleGenerate}
              disabled={generate.isPending}
            >
              再来一句
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
