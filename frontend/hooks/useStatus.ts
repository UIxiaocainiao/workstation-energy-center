import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { getDeviceId } from "@/lib/device";

export type StatusOption = {
  key: string;
  name: string;
  count?: number;
};

type TodayStatusResponse = {
  record: {
    statusKey: string;
    date: string;
  } | null;
};

type StatusStatsResponse = {
  total: number;
  items: Array<{ statusKey: string; statusName: string; count: number }>;
};

export function useStatus(date: string) {
  const queryClient = useQueryClient();
  const deviceId = typeof window !== "undefined" ? getDeviceId() : "server";

  const todayStatus = useQuery({
    queryKey: ["today-status", deviceId, date],
    queryFn: () => apiClient.get<TodayStatusResponse>("/status/today", { deviceId, date })
  });

  const stats = useQuery({
    queryKey: ["status-stats", date],
    queryFn: () => apiClient.get<StatusStatsResponse>("/status/stats", { date })
  });

  const submit = useMutation({
    mutationFn: (statusKey: string) =>
      apiClient.post("/status/submit", { statusKey, deviceId, date }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["today-status", deviceId, date] }),
        queryClient.invalidateQueries({ queryKey: ["status-stats", date] })
      ]);
    }
  });

  return { todayStatus, stats, submit };
}
