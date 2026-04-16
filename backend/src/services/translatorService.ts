export type TranslatorMode = "boss_to_truth" | "truth_to_polite";

const fallbackMap: Record<TranslatorMode, string[]> = {
  boss_to_truth: [
    "真实含义：这事看起来不复杂，但实际默认你来兜底。",
    "真实含义：我先把压力递给你，具体难度之后再说。",
    "真实含义：这句话的潜台词，通常是时间紧、资源少、责任大。 "
  ],
  truth_to_polite: [
    "更体面的表达：当前任务边界和职责归属还需要先对齐。",
    "更体面的表达：按照现有时间排期，交付风险较高，建议重新评估。",
    "更体面的表达：这个方案迭代次数较多，建议先统一目标再继续推进。 "
  ]
};

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateTranslatorText(
  mode: TranslatorMode,
  inputText: string,
  templates: Array<{ keyword: string; templateText: string }>
) {
  const normalized = inputText.trim();
  const matched = templates.filter((item) => normalized.includes(item.keyword));
  const pool = matched.length > 0 ? matched : fallbackMap[mode].map((text) => ({ keyword: "", templateText: text }));
  const selected = pickRandom(pool);

  return {
    resultText: selected.templateText.replace("{input}", normalized),
    resultType: mode === "boss_to_truth" ? "老板黑话翻译结果" : "体面表达结果",
    shareText: `「${normalized}」\n${selected.templateText.replace("{input}", normalized)}`
  };
}
