import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export type TranslatorMode = "boss_to_truth" | "truth_to_polite";

type ExampleResponse = {
  mode: TranslatorMode;
  examples: string[];
};

type GenerateResponse = {
  resultText: string;
  resultType: string;
  shareText: string;
  templateId?: string | null;
};

export function useTranslator(mode: TranslatorMode) {
  const examples = useQuery({
    queryKey: ["translator-examples", mode],
    queryFn: () => apiClient.get<ExampleResponse>("/translator/examples", { mode })
  });

  const generate = useMutation({
    mutationFn: (inputText: string) =>
      apiClient.post<GenerateResponse>("/translator/generate", { mode, inputText })
  });

  return { examples, generate };
}
