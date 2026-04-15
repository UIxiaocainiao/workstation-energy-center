import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type ComfortTextResponse = {
  id: string;
  content: string;
};

export function useComfort() {
  const daily = useQuery({
    queryKey: ["comfort-daily"],
    queryFn: () => apiClient.get<ComfortTextResponse>("/comfort/daily")
  });

  const random = useMutation({
    mutationFn: () => apiClient.get<ComfortTextResponse>("/comfort/random")
  });

  return { daily, random };
}
